package com.zephyra.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class BackendApplication {

	private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

	public static void main(String[] args) {
		loadDotenvIfPresent();
		SpringApplication.run(BackendApplication.class, args);
	}

	private static void loadDotenvIfPresent() {
		File[] candidates = new File[] { new File(".env"), new File("backend/.env") };
		for (File candidate : candidates) {
			if (candidate.exists() && candidate.isFile()) {
				log.info("Loading local environment properties from: {}", candidate.getAbsolutePath());
				try (BufferedReader reader = new BufferedReader(new FileReader(candidate))) {
					String line;
					while ((line = reader.readLine()) != null) {
						line = line.trim();
						if (line.isEmpty() || line.startsWith("#")) {
							continue;
						}
						int eqIdx = line.indexOf('=');
						if (eqIdx > 0) {
							String key = line.substring(0, eqIdx).trim();
							String value = line.substring(eqIdx + 1).trim();
							if ((value.startsWith("\"") && value.endsWith("\"")) ||
								(value.startsWith("'") && value.endsWith("'"))) {
								value = value.substring(1, value.length() - 1);
							}
							if (System.getProperty(key) == null && System.getenv(key) == null) {
								System.setProperty(key, value);
							}
						}
					}
				} catch (IOException e) {
					log.warn("Could not read .env file {}: {}", candidate.getAbsolutePath(), e.getMessage());
				}
				break;
			}
		}
	}

}
