require_relative 'lib'
require_relative 'cron'
require_relative 'webhook'

module Sb2Gorgias
  LOGGER = Sb2Gorgias.new_logger('main')

  def self.run(mode, pandium)
    case mode
    when 'webhook' then Webhook.run(pandium)
    else Cron.run(pandium)
    end
  end

  def self.main
    pandium = Pandium.from_env
    LOGGER.info("syncing ShipBob to Gorgias; run_mode=#{pandium.run_mode}")
    metadata = run(pandium.run_mode, pandium)
    pandium.update_metadata(metadata)
  end
end

Sb2Gorgias.main if $PROGRAM_NAME == __FILE__
