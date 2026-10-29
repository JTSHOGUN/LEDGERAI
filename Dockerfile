FROM node:20-alpine AS runner
WORKDIR /app
COPY ledgerai-business ./
EXPOSE 5173
ENV PORT=5173
ENV HOST=0.0.0.0
CMD ["node", "./ledgerai-business"]
