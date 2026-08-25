
plugins {
    kotlin("jvm") version "2.4.10"
    kotlin("plugin.serialization") version "2.4.10"
    application
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.github.cdimascio:dotenv-java:3.2.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
    implementation("io.github.oshai:kotlin-logging-jvm:8.0.4")
    runtimeOnly("ch.qos.logback:logback-classic:1.5.38")
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

application {
    mainClass = "MainKt"
}

tasks.register<Jar>("fatJar") {
    group = "build"
    description = "Creates a fat JAR with all dependencies"

    manifest {
        attributes["Main-Class"] = "MainKt"
    }

    archiveClassifier.set("all")
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE

    from(sourceSets.main.get().output)

    dependsOn(configurations.runtimeClasspath)
    from({
        configurations.runtimeClasspath.get().filter { it.name.endsWith("jar") }.map { zipTree(it) }
    })
}
