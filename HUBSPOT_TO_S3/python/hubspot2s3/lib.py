import os

truthy = lambda s: s and isinstance(s, str) and s.lower() in ['true', '1', 't', 'y', 'yes']


class Config:
    def __init__(self, **d):
        self.__dict__ = d

    def __unicode__(self):
        return ','.join([f'{k}: {v}' for k, v in self.__dict__.items()])

    def __repr__(self):
        return ','.join([f'{k}: {v}' for k, v in self.__dict__.items()])

    def __getattr__(self, attr):
        return None

    @classmethod
    def from_env(cls):
        kwargs = {}
        for k, v in os.environ.items():
            if k.startswith('PAN_CFG_'):
                kwargs[k[len('PAN_CFG_'):].lower()] = v.replace('\\n', '').replace('\n', '')

        return cls(**kwargs)


class Secrets:
    def __init__(self, **d):
        self.__dict__ = d

    def __unicode__(self):
        return ','.join([f'{k}: {v}' for k, v in self.__dict__.items()])

    def __repr__(self):
        return ','.join([f'{k}: {v}' for k, v in self.__dict__.items()])

    @classmethod
    def from_env(cls):
        kwargs = {}
        for k, v in os.environ.items():
            if k.startswith('PAN_SEC_'):
                kwargs[k[len('PAN_SEC_'):].strip().lower()] = v.replace('\\n', '').replace('\n', '')

        return cls(**kwargs)


class Context:

    def __init__(self, **d):
        self.__dict__ = d

    def __unicode__(self):
        return ','.join([f'{k}: {v}' for k, v in self.__dict__.items()])

    def __repr__(self):
        return ','.join([f'{k}: {v}' for k, v in self.__dict__.items()])

    def __getattr__(self, attr):
        return None

    @classmethod
    def from_env(cls):
        kwargs = {}
        for k, v in os.environ.items():
            if k.startswith('PAN_CTX_'):
                kwargs[k[len('PAN_CTX_'):].strip().lower()] = v.replace('\\n', '').replace('\n', '')
        return cls(**kwargs)
