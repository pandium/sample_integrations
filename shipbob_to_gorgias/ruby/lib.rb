require 'json'
require 'logger'

module Sb2Gorgias
  LOG_FORMATTER = proc do |severity, datetime, progname, msg|
    "[#{datetime.strftime('%Y-%m-%d %H:%M:%S')}] [#{progname}] #{severity}: #{msg}\n"
  end

  def self.new_logger(progname)
    Logger.new($stderr, progname: progname, formatter: LOG_FORMATTER)
  end

  # Safe nested lookup by dotted path, e.g. deep_get(order, 'recipient.address.city').
  # Returns default at any non-Hash intermediate, or when the resolved leaf is nil.
  def self.deep_get(data, path, default = nil)
    cur = data
    path.split('.').each do |part|
      return default unless cur.is_a?(Hash)

      cur = cur[part]
    end
    cur.nil? ? default : cur
  end

  # Falls through on any of nil/''/0/false, not just nil/false the way Ruby's || does.
  def self.loose_or(a, b)
    (a.nil? || a == '' || a == 0 || a == false) ? b : a
  end

  # Collect env vars starting with prefix, stripping the prefix and lower-casing the rest.
  def self.env_values(prefix)
    ENV.each_with_object({}) do |(key, val), result|
      result[key.delete_prefix(prefix).downcase] = val if key.start_with?(prefix)
    end
  end

  # A naive-datetime-style ISO 8601 string: no fractional part when it's exactly zero.
  def self.isoformat(time)
    base = time.strftime('%Y-%m-%dT%H:%M:%S')
    time.usec.zero? ? base : "#{base}.#{format('%06d', time.usec)}"
  end

  WebhookDelivery = Struct.new(:id, :body)

  # Everything Pandium hands to an integration at runtime. config (PAN_CFG_*) and secrets
  # (PAN_SEC_*) hold arbitrary keys defined per integration and are exposed as plain hashes.
  # context (PAN_CTX_*) is controlled by Pandium, so its values are surfaced through named
  # methods instead.
  class Pandium
    LOGGER = Sb2Gorgias.new_logger('lib')

    attr_reader :config, :secrets

    def initialize(config, secrets, context)
      @config = config
      @secrets = secrets
      @context = context
    end

    def self.from_env
      new(Sb2Gorgias.env_values('PAN_CFG_'), Sb2Gorgias.env_values('PAN_SEC_'), Sb2Gorgias.env_values('PAN_CTX_'))
    end

    def run_mode
      @context['run_mode']
    end

    def run_triggers
      raw = @context['run_triggers']
      return [] if raw.nil? || raw.empty?

      JSON.parse(raw)
    rescue JSON::ParserError => e
      LOGGER.error("could not parse run triggers as JSON: #{raw}: #{e}")
      []
    end

    # NOTE: filters on trigger['source'], not trigger['mode'] -- mode reflects the run as a
    # whole, so every trigger in a webhook-mode run would match it regardless of what actually
    # caused each one. source is the field that answers "why did this specific trigger fire."
    def webhook_deliveries
      run_triggers.filter_map do |trigger|
        next unless trigger['source'] == 'webhook'

        payload = trigger['payload'] || {}
        file = payload['file']
        if file.nil? || file.empty?
          LOGGER.warn("webhook trigger #{trigger['id']} has no payload file")
          next
        end

        begin
          body = File.read(file, encoding: 'UTF-8')
        rescue SystemCallError => e
          LOGGER.error("could not read webhook payload #{file}: #{e}")
          next
        end

        WebhookDelivery.new(trigger['id'].to_s, body)
      end
    end

    def metadata
      return @metadata if defined?(@metadata)

      filename = @context['tenant_metadata_file']
      @metadata =
        begin
          filename && !filename.empty? ? JSON.parse(File.read(filename, encoding: 'UTF-8')) : nil
        rescue SystemCallError, JSON::ParserError => e
          LOGGER.error("could not read tenant metadata from #{filename}: #{e}")
          nil
        end
    end

    # Merge metadata into the tenant metadata that the next run reads back. Pandium reads the
    # last non-empty line of stdout as the metadata, so this must be the only stdout write.
    def update_metadata(metadata)
      json = JSON.generate(metadata)
      LOGGER.info("updating metadata with #{json}")
      puts json
    end
  end
end
