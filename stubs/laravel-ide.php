<?php

// Lightweight IDE stubs for a workspace that does not include a full Laravel vendor tree.
// These are for static analysis only.

namespace {
    if (!function_exists('response')) {
        function response(): \Illuminate\Http\ResponseFactory
        {
            return new \Illuminate\Http\ResponseFactory();
        }
    }
}

namespace Illuminate\Http {
    class ResponseFactory
    {
        public function json(mixed $data = null, int $status = 200, array $headers = [], int $options = 0): JsonResponse
        {
            return new JsonResponse($data, $status, $headers, $options);
        }
    }

    class JsonResponse extends \Symfony\Component\HttpFoundation\Response
    {
        public function __construct(mixed $data = null, int $status = 200, array $headers = [], int $options = 0) {}
    }

    class Request
    {
        public function validate(array $rules, array $messages = [], array $attributes = []): array
        {
            return [];
        }

        public function user(): mixed
        {
            return null;
        }

        public function hasFile(string $key): bool
        {
            return false;
        }

        public function file(string $key): mixed
        {
            return null;
        }
    }
}

namespace Illuminate\Routing {
    class Controller {}
}

namespace Illuminate\Foundation\Auth {
    class User extends \Illuminate\Database\Eloquent\Model {}
}

namespace Illuminate\Database\Eloquent\Factories {
    trait HasFactory {}
}

namespace Illuminate\Notifications {
    trait Notifiable {}
}

namespace Laravel\Sanctum {
    trait HasApiTokens
    {
        public function createToken(string $name, array $abilities = ['*']): NewAccessToken
        {
            return new NewAccessToken();
        }

        public function currentAccessToken(): ?PersonalAccessToken
        {
            return new PersonalAccessToken();
        }
    }

    class NewAccessToken
    {
        public string $plainTextToken = 'stub-token';
    }

    class PersonalAccessToken
    {
        public function delete(): void {}
    }
}

namespace Illuminate\Support\Facades {
    class Hash
    {
        public static function make(string $value, array $options = []): string
        {
            return $value;
        }

        public static function check(string $value, string $hashedValue, array $options = []): bool
        {
            return true;
        }
    }

    class Route
    {
        public static function post(string $uri, callable|string|array $action = null): RouteRegistrar
        {
            return new RouteRegistrar();
        }

        public static function get(string $uri, callable|string|array $action = null): RouteRegistrar
        {
            return new RouteRegistrar();
        }

        public static function put(string $uri, callable|string|array $action = null): RouteRegistrar
        {
            return new RouteRegistrar();
        }

        public static function delete(string $uri, callable|string|array $action = null): RouteRegistrar
        {
            return new RouteRegistrar();
        }

        public static function middleware(string|array $middleware): RouteRegistrar
        {
            return new RouteRegistrar();
        }

        public static function apiResource(string $name, string $controller, array $options = []): RouteRegistrar
        {
            return new RouteRegistrar();
        }

        public static function resource(string $name, string $controller, array $options = []): RouteRegistrar
        {
            return new RouteRegistrar();
        }

        public static function group(array $attributes, callable $callback): void {}
    }

    class RouteRegistrar
    {
        public function post(string $uri, callable|string|array $action = null): self
        {
            return $this;
        }

        public function get(string $uri, callable|string|array $action = null): self
        {
            return $this;
        }

        public function put(string $uri, callable|string|array $action = null): self
        {
            return $this;
        }

        public function delete(string $uri, callable|string|array $action = null): self
        {
            return $this;
        }

        public function middleware(string|array $middleware): self
        {
            return $this;
        }

        public function apiResource(string $name, string $controller, array $options = []): self
        {
            return $this;
        }

        public function resource(string $name, string $controller, array $options = []): self
        {
            return $this;
        }

        public function group(callable $callback): void {}
    }

    class Schema
    {
        public static function table(string $table, callable $callback): void {}

        public static function create(string $table, callable $callback): void {}

        public static function dropIfExists(string $table): void {}
    }

    class Storage
    {
        public static function disk(string $name): self
        {
            return new self();
        }

        public function delete(string $path): bool
        {
            return true;
        }
    }
}

namespace Illuminate\Database\Migrations {
    abstract class Migration {}
}

namespace Illuminate\Database\Schema {
    class Blueprint
    {
        public function id(): self
        {
            return $this;
        }

        public function string(string $column, int|string|null $length = null): ColumnDefinition
        {
            return new ColumnDefinition();
        }

        public function text(string $column): ColumnDefinition
        {
            return new ColumnDefinition();
        }

        public function unsignedInteger(string $column): ColumnDefinition
        {
            return new ColumnDefinition();
        }

        public function decimal(string $column, int $total = 8, int $places = 2): ColumnDefinition
        {
            return new ColumnDefinition();
        }

        public function enum(string $column, array $allowed): ColumnDefinition
        {
            return new ColumnDefinition();
        }

        public function timestamps(): self
        {
            return $this;
        }

        public function foreignId(string $column): ForeignIdColumnDefinition
        {
            return new ForeignIdColumnDefinition();
        }

        public function dropColumn(string|array $columns): void {}
    }

    class ForeignIdColumnDefinition
    {
        public function constrained(?string $table = null, ?string $column = null): self
        {
            return $this;
        }

        public function restrictOnDelete(): self
        {
            return $this;
        }

        public function cascadeOnDelete(): self
        {
            return $this;
        }

        public function nullOnDelete(): self
        {
            return $this;
        }

        public function nullable(bool $value = true): self
        {
            return $this;
        }

        public function default(mixed $value): self
        {
            return $this;
        }

        public function after(string $column): self
        {
            return $this;
        }
    }

    class ColumnDefinition
    {
        public function nullable(bool $value = true): self
        {
            return $this;
        }

        public function default(mixed $value): self
        {
            return $this;
        }

        public function after(string $column): self
        {
            return $this;
        }
    }
}

namespace Illuminate\Database\Eloquent {
    class Model
    {
        /** @var array<int, string> */
        protected array $fillable = [];

        /** @var array<string, string> */
        protected array $casts = [];

        protected bool $timestamps = true;

        public static function query(): Builder
        {
            return new Builder();
        }

        public static function create(array $attributes = []): static
        {
            return new static();
        }

        public static function where(string $column, mixed $operator, mixed $value = null): Builder
        {
            return new Builder();
        }

        public static function with(array|string $relations): Builder
        {
            return new Builder();
        }

        public static function latest(string $column = 'created_at'): Builder
        {
            return new Builder();
        }

        public static function find(mixed $id): mixed
        {
            return null;
        }

        public function update(array $attributes = []): bool
        {
            return true;
        }

        public function delete(): bool
        {
            return true;
        }

        public function fresh(): static
        {
            return $this;
        }

        public function load(array|string $relations): static
        {
            return $this;
        }

        public function relationLoaded(string $relation): bool
        {
            return false;
        }

        public function hasMany(string $related, string $foreignKey = null, string $localKey = null): mixed
        {
            return null;
        }

        public function belongsTo(string $related, string $foreignKey = null, string $ownerKey = null, string $relation = null): mixed
        {
            return null;
        }

        public function __get(string $name): mixed
        {
            return null;
        }
    }

    class Builder
    {
        public function get(array $columns = ['*']): array
        {
            return [];
        }

        public function first(array $columns = ['*']): mixed
        {
            return null;
        }

        public function latest(string $column = 'created_at'): self
        {
            return $this;
        }

        public function with(array|string $relations): self
        {
            return $this;
        }
    }
}

namespace Symfony\Component\HttpFoundation {
    class Response {}
}

namespace Illuminate\Http\Resources\Json {
    class JsonResource
    {
        public mixed $resource;

        public static function collection(mixed $resource): array
        {
            return [];
        }

        public function whenLoaded(string $relationship): mixed
        {
            return null;
        }

        public function relationLoaded(string $relationship): bool
        {
            return false;
        }

        public function __get(string $name): mixed
        {
            return null;
        }
    }
}
