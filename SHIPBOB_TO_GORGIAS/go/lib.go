package main

import (
	"os"
	"strings"
)

type KV struct {
	items map[string]interface{}
}

type Item struct {
	kv KV
}

func (kv KV) repr() string {
	itemsList := ""
	for key, value := range kv.items {
		if itemsList != "" {
			itemsList += ", "
		}
		itemsList += key + ": " + value.(string)
	}
	return itemsList
}

func match(prefix string) map[string]interface{} {
	items := make(map[string]interface{})
	for _, e := range os.Environ() {
		pair := strings.SplitN(e, "=", 2)
		if strings.HasPrefix(pair[0], prefix) {
			key := strings.TrimPrefix(pair[0], prefix)
			value := strings.ReplaceAll(strings.ReplaceAll(pair[1], "\\n", ""), "\n", "")
			items[strings.ToLower(key)] = value
		}
	}
	return items
}

func NewItemFromEnv(prefix string) *Item {
	return &Item{KV{items: match(prefix)}}
}

type Config struct {
	Item
}

type Secrets struct {
	Item
}

type Context struct {
	Item
}

func NewConfigFromEnv() *Config {
	return &Config{*NewItemFromEnv("PAN_CFG_")}
}

func NewSecretsFromEnv() *Secrets {
	return &Secrets{*NewItemFromEnv("PAN_SEC_")}
}

func NewContextFromEnv() *Context {
	return &Context{*NewItemFromEnv("PAN_CTX_")}
}
