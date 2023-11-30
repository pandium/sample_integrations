class Config
    def initialize(**d)
        @__dict__ = d
    end

    def from_env
        kwargs = {}
        ENV.each_pair do |k, v|
            if k.start_with?('PAN_CFG_')
                kwargs[k['PAN_CFG_'.length..-1].downcase] = v.gsub('\\n', '').gsub('\n', '')
            end
        end
        return kwargs
    end
end


class Secrets
    def initialize(**d)
        @__dict__ = d
    end

    def from_env
        kwargs = {}
        ENV.each_pair do |k, v|
            if k.start_with?('PAN_SEC_')
                kwargs[k['PAN_SEC_'.length..-1].strip().downcase] = v.gsub('\\n', '').gsub('\n', '')
            end
        end
        return kwargs
    end
end


class Context

    def initialize(**d)
        @__dict__ = d
    end

    def from_env
        kwargs = {}
        ENV.each_pair do |k, v|
            if k.start_with?('PAN_CTX_')
                kwargs[k['PAN_CTX_'.length..-1].strip().downcase] = v.gsub('\\n', '').gsub('\n', '')
            end
        end
        return kwargs
    end
end

def isTruthy(resource)
    truth = ['true', '1', 't', 'y', 'yes', 1, true]
    truth.include? resource 
end
