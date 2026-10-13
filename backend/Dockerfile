# ==============================================================================
# Production Multi-Stage Dockerfile for Spring Boot 21 LTS
# Optimized for Render.com deployment with dynamic PORT binding
# ==============================================================================

# Stage 1: Build JAR with Maven
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper & pom for dependency layer caching
COPY pom.xml mvnw ./
COPY .mvn .mvn/
RUN chmod +x ./mvnw

# Download dependencies (skip offline failure if any plugin missing)
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build production artifact
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S zephyra && adduser -S zephyra -G zephyra
USER zephyra

# Copy compiled jar from build stage
COPY --from=build --chown=zephyra:zephyra /app/target/*.jar app.jar

# Render assigns a dynamic PORT environment variable (default 8080)
ENV PORT=8080
EXPOSE ${PORT}

# Run with container-aware memory flags and dynamic port
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -jar app.jar"]
