FROM node:20-alpine
WORKDIR /app

# Copy package files for dependency installation
# package-lock.json* uses optional copying - if the file exists it will be copied,
# if not, the build continues without error. This ensures reproducible builds when
# package-lock.json is available while allowing builds to succeed when it's not present.
COPY package.json package-lock.json* ./

# Install production dependencies
# Removed '|| true' fallback to properly surface any real npm install errors
# while maintaining compatibility with optional package-lock.json
RUN npm install --omit=dev

COPY . .
ENV PORT=8080
CMD ["npm","start"]
