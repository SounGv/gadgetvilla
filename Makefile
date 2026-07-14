.PHONY: setup dev build test lint db-migrate db-seed docker-dev docker-prod down

setup:        ## ตั้งค่าครั้งแรก (env + install + migrate + seed)
	bash scripts/setup.sh

dev:          ## รัน dev (web + api)
	pnpm dev

build:        ## build ทั้งหมด
	pnpm build

test:         ## รัน unit tests
	pnpm test

lint:         ## lint + typecheck
	pnpm lint && pnpm typecheck

db-migrate:   ## รัน prisma migrate
	pnpm --filter @gv/db migrate

db-seed:      ## seed master data
	pnpm --filter @gv/db seed

docker-dev:   ## รันทั้งชุดด้วย docker (dev)
	docker compose up --build

docker-prod:  ## รัน production stack
	docker compose -f docker-compose.prod.yml up --build -d

down:         ## หยุด docker
	docker compose down
