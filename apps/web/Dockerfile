# OpenCut web editor — self-hosted image.
#
# Приложение — TanStack Start (SSR) поверх Cloudflare Workers runtime.
# Прод-сборка запускается через `vite preview`, который поднимает собранный
# worker в workerd (miniflare) — поэтому dev-зависимости остаются в образе.
#
# VITE_BASE_PATH задаёт подпуть, под которым живёт приложение
# (для rieltai.ru/editor это /editor/).
#
# База — node, а не oven/bun: vite 8 требует module.registerHooks из node:module,
# которого нет в bun (под чистым bun сборка падает). bun здесь только пакетный
# менеджер, vite запускается под node через shebang.

FROM node:24-slim

COPY --from=oven/bun:1.3.11 /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

# Сначала только манифест — слой с зависимостями кэшируется отдельно от исходников
COPY package.json bun.lock* ./
RUN bun install

COPY . .

ARG VITE_BASE_PATH=/editor/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}
RUN bun run build

# Vite прописывает в HTML URL вида /editor/assets/..., но workerd раздаёт
# статику из dist/client от корня (base его не касается) — без этого шага
# все ассеты отдавали бы 404. Перекладываем dist/client в dist/client/<base>,
# чтобы физические пути совпали с URL.
RUN set -eux; \
    base="${VITE_BASE_PATH#/}"; base="${base%/}"; \
    if [ -n "$base" ]; then \
      mv dist/client dist/.tmp-client; \
      mkdir -p "dist/client/$(dirname "$base")"; \
      mv dist/.tmp-client "dist/client/$base"; \
    fi

EXPOSE 3000

# host/port/allowedHosts заданы в vite.config.ts (preview-блок)
CMD ["bun", "run", "preview"]
