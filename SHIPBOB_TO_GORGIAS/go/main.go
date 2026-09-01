package main

import (
	"fmt"
	"log"
	"os"
	"strings"
)

func getPandiumIntegrationsMode(ctx *Context) string {
	return ctx.Item.kv.items["run_mode"].(string)
}

func logEnv() {
	for _, e := range os.Environ() {
		pair := strings.SplitN(e, "=", 2)
		log.Println(pair[0], pair[1])
	}
}

func main() {
	config := NewConfigFromEnv()
	secrets := NewSecretsFromEnv()
	context := NewContextFromEnv()

	runMode := getPandiumIntegrationsMode(context)

	fmt.Println("This run is in mode: ", runMode)

	log.Println("------------------------CONFIG------------------------")
	log.Println(config.Item.kv.repr())

	log.Println("------------------------SECRET------------------------")
	log.Println(secrets.Item.kv.repr())

	log.Println("------------------------CONTEXT------------------------")
	log.Println(context.Item.kv.repr())

	log.Println("------------------------ENV----------------------------")
	logEnv()
}
