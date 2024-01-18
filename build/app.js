"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_zod5 = require("zod");
var import_http_status9 = __toESM(require("http-status"));
var import_jwt = __toESM(require("@fastify/jwt"));
var import_helmet = __toESM(require("@fastify/helmet"));
var import_cookie = __toESM(require("@fastify/cookie"));
var import_swagger = __toESM(require("@fastify/swagger"));
var import_swagger_ui = __toESM(require("@fastify/swagger-ui"));
var import_under_pressure = __toESM(require("@fastify/under-pressure"));
var import_fastify = __toESM(require("fastify"));

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: import_zod.z.string(),
  DB_DATABASE: import_zod.z.string(),
  DB_USERNAME: import_zod.z.string(),
  DB_PASSWORD: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u274C Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/http/middlewares/verify-jwt.ts
var import_http_status = __toESM(require("http-status"));
async function verifyJwt(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(import_http_status.default.UNAUTHORIZED).send({ message: "Unauthorized." });
  }
}

// src/http/controllers/users/authenticate.ts
var import_http_status2 = __toESM(require("http-status"));

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid credentials.");
  }
};

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/repositories/prisma/prisma-users-repository.ts
var PrismaUsersRepository = class {
  async findById(id) {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });
    return user;
  }
  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    return user;
  }
  async create(data) {
    const user = await prisma.user.create({
      data
    });
    return user;
  }
  async update(data) {
    const user = await prisma.user.update({
      where: {
        id: data.id
      },
      data
    });
    return user;
  }
  async delete(data) {
    await prisma.user.delete(data);
  }
};

// src/use-cases/authenticate.ts
var import_bcrypt = require("bcrypt");
var AuthenticateUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    password
  }) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const doestPasswordMatches = await (0, import_bcrypt.compare)(
      password,
      user.hash_password
    );
    if (!doestPasswordMatches) {
      throw new InvalidCredentialsError();
    }
    return {
      user
    };
  }
};

// src/use-cases/factories/users/make-authenticate-use-case.ts
function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(usersRepository);
  return authenticateUseCase;
}

// src/validate/authenticateBodySchema.ts
var import_zod2 = require("zod");
var authenticateBodySchema = import_zod2.z.object({
  email: import_zod2.z.string().email(),
  password: import_zod2.z.string().min(6)
});

// src/http/controllers/users/authenticate.ts
async function authenticate(request, reply) {
  const { email, password } = authenticateBodySchema.parse(request.body);
  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const { user } = await authenticateUseCase.execute({
      email,
      password
    });
    const token = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id
        }
      }
    );
    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d"
        }
      }
    );
    return reply.setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true
    }).status(import_http_status2.default.OK).send({
      token
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(import_http_status2.default.BAD_REQUEST).send({ message: err.message });
    }
    throw err;
  }
}

// src/http/controllers/users/profile.ts
var import_http_status3 = __toESM(require("http-status"));

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found.");
  }
};

// src/use-cases/get-user-profile.ts
var GetUserProfileUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    userId
  }) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFoundError();
    }
    return {
      user
    };
  }
};

// src/use-cases/factories/users/make-get-user-profile-use.case.ts
function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(usersRepository);
  return useCase;
}

// src/http/controllers/users/profile.ts
async function profile(request, reply) {
  const getUserProfile = makeGetUserProfileUseCase();
  const { user } = await getUserProfile.execute({
    userId: request.user.sub
  });
  return reply.status(import_http_status3.default.OK).send({
    user: {
      ...user,
      password_hash: void 0
    }
  });
}

// src/http/controllers/users/register.ts
var import_http_status4 = __toESM(require("http-status"));

// src/use-cases/errors/user-already-exists-error.ts
var UserAlreadyExistsError = class extends Error {
  constructor() {
    super("E-mail already exists.");
  }
};

// src/use-cases/register.ts
var import_bcrypt2 = require("bcrypt");
var RegisterUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    name,
    email,
    password,
    role
  }) {
    const passwordHash = await (0, import_bcrypt2.hash)(password, 6);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
    const user = await this.usersRepository.create({
      name,
      email,
      hash_password: passwordHash,
      role
    });
    return {
      user
    };
  }
};

// src/use-cases/factories/users/make-register-use-case.ts
function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);
  return registerUseCase;
}

// src/validate/registerBodySchema.ts
var import_zod3 = require("zod");
var registerBodySchema = import_zod3.z.object({
  name: import_zod3.z.string(),
  email: import_zod3.z.string().email(),
  password: import_zod3.z.string().min(6),
  role: import_zod3.z.enum(["Admin", "User"]).default("User")
});

// src/http/controllers/users/register.ts
async function register(request, reply) {
  const {
    name,
    email,
    password,
    role
  } = registerBodySchema.parse(
    request.body
  );
  try {
    const registerUseCase = makeRegisterUseCase();
    await registerUseCase.execute({
      name,
      email,
      password,
      role
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(import_http_status4.default.CONFLICT).send({ message: error.message });
    }
    throw error;
  }
  return reply.status(import_http_status4.default.CREATED).send();
}

// src/http/controllers/users/refresh.ts
var import_http_status5 = __toESM(require("http-status"));
async function refresh(request, reply) {
  await request.jwtVerify({ onlyCookie: true });
  const { role } = request.user;
  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub
      }
    }
  );
  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: "7d"
      }
    }
  );
  return reply.setCookie("refreshToken", refreshToken, {
    path: "/",
    secure: true,
    sameSite: true,
    httpOnly: true
  }).status(import_http_status5.default.OK).send({
    token
  });
}

// src/http/routes/users/user.route.ts
async function usersRoutes(app2) {
  app2.post("/users", register);
  app2.post("/sessions", authenticate);
  app2.patch("/token/refresh", refresh);
  app2.get("/me", { onRequest: [verifyJwt] }, profile);
}

// src/http/controllers/dishes/list-by-name.ts
var import_http_status6 = __toESM(require("http-status"));

// src/repositories/prisma/prisma-dishes-repository.ts
var PrismaDishesRepository = class {
  async findAll() {
    const dish = await prisma.dish.findMany();
    return dish;
  }
  async findById(id) {
    const dish = await prisma.dish.findUnique({
      where: {
        id
      }
    });
    return dish;
  }
  async findByName(name) {
    const dish = await prisma.dish.findFirst({
      where: {
        name
      }
    });
    return dish;
  }
  async create(data) {
    const dish = await prisma.dish.create({
      data
    });
    return dish;
  }
  async update(data) {
    const dish = await prisma.dish.update({
      where: {
        id: data.id
      },
      data
    });
    return dish;
  }
  async delete(id) {
    await prisma.dish.delete({
      where: {
        id
      }
    });
  }
};

// src/use-cases/get-dish-list-by-name.ts
var GetDishListByNameUseCase = class {
  constructor(dishesRepository) {
    this.dishesRepository = dishesRepository;
  }
  async execute({
    name
  }) {
    const dish = await this.dishesRepository.findByName(name);
    if (!dish) {
      throw new ResourceNotFoundError();
    }
    return {
      dish
    };
  }
};

// src/use-cases/factories/dishes/make-dish-list-by-name-use-case.ts
function makeDishesListByNameUseCase() {
  const dishesRepository = new PrismaDishesRepository();
  const useCase = new GetDishListByNameUseCase(dishesRepository);
  return useCase;
}

// src/use-cases/errors/dish-already-exists-error.ts
var DishAlreadyExistsError = class extends Error {
  constructor() {
    super("Dish already exists.");
  }
};

// src/http/controllers/dishes/list-by-name.ts
function formatId(str) {
  const formattedStr = str.replace(/\b\w/g, (match) => match.toUpperCase());
  return formattedStr.replace(/-/g, " ");
}
async function listByName(request, reply) {
  const { id } = request.params;
  const dishIdFormatted = formatId(id);
  let dish;
  try {
    const getDishesList = makeDishesListByNameUseCase();
    const { dish: dishData } = await getDishesList.execute({
      name: dishIdFormatted
    });
    dish = dishData;
  } catch (error) {
    if (error instanceof DishAlreadyExistsError) {
      return reply.status(import_http_status6.default.CONFLICT).send({ message: error.message });
    }
    throw error;
  }
  return reply.status(import_http_status6.default.OK).send({
    dish
  });
}

// src/http/controllers/dishes/create-dish.ts
var import_http_status7 = __toESM(require("http-status"));

// src/use-cases/create-dish.ts
var CreateDishUseCase = class {
  constructor(dishesRepository) {
    this.dishesRepository = dishesRepository;
  }
  async execute({
    name,
    price,
    description,
    photo
  }) {
    const dishWithSameName = await this.dishesRepository.findByName(name);
    if (dishWithSameName) {
      throw new DishAlreadyExistsError();
    }
    const dish = await this.dishesRepository.create({
      name,
      price,
      description,
      photo
    });
    return {
      dish
    };
  }
};

// src/use-cases/factories/dishes/make-create-dish-use-case.ts
function makeCreateDishUseCase() {
  const dishesRepository = new PrismaDishesRepository();
  const createDishUseCase = new CreateDishUseCase(dishesRepository);
  return createDishUseCase;
}

// src/validate/createDishBodySchema.ts
var import_zod4 = require("zod");
var createDishBodySchema = import_zod4.z.object({
  name: import_zod4.z.string(),
  price: import_zod4.z.coerce.number(),
  description: import_zod4.z.string(),
  photo: import_zod4.z.string().optional()
});

// src/http/controllers/dishes/create-dish.ts
async function createDish(request, reply) {
  const {
    name,
    price,
    description,
    photo
  } = createDishBodySchema.parse(
    request.body
  );
  try {
    const createUseCase = makeCreateDishUseCase();
    await createUseCase.execute({
      name,
      price,
      description,
      photo
    });
  } catch (error) {
    if (error instanceof DishAlreadyExistsError) {
      return reply.status(import_http_status7.default.CONFLICT).send({ message: error.message });
    }
    throw error;
  }
  return reply.status(import_http_status7.default.CREATED).send();
}

// src/http/controllers/dishes/all-dishes.ts
var import_http_status8 = __toESM(require("http-status"));

// src/use-cases/get-all-dishes-list.ts
var GetDishListUseCase = class {
  constructor(dishesRepository) {
    this.dishesRepository = dishesRepository;
  }
  async all() {
    const dishes = await this.dishesRepository.findAll();
    return {
      dishes
    };
  }
};

// src/use-cases/factories/dishes/make-dishes-list-use-case.ts
function makeDishesListUseCase() {
  const dishesRepository = new PrismaDishesRepository();
  const useCase = new GetDishListUseCase(dishesRepository);
  return useCase;
}

// src/http/controllers/dishes/all-dishes.ts
async function allDishes(request, reply) {
  const getDishesList = makeDishesListUseCase();
  const { dishes } = await getDishesList.all();
  return reply.status(import_http_status8.default.OK).send({
    dish: {
      ...dishes
    }
  });
}

// src/lib/swagger/dishes/index.ts
var getAllOptionsDishRoutes = {
  title: "Get All Dishes",
  description: "List all dishes, paginated using a cursor paginator.",
  tags: ["dishes"],
  version: "0.1.0",
  produces: ["application/json"],
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", default: 1, description: "Page number" },
      limit: { type: "integer", default: 10, description: "Items per page" },
      sortBy: { type: "string", enum: ["name", "price"], description: "Sort by field" },
      sortOrder: { type: "string", enum: ["asc", "desc"], description: "Sort order" },
      search: { type: "string", description: "Search term" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        results: {
          type: "array",
          // Indica que 'results' é um array
          items: {
            type: "object",
            // Cada elemento do array é um objeto
            properties: {
              id: {
                type: "string",
                format: "uuid"
              },
              name: {
                type: "string"
              },
              description: {
                type: "string"
              },
              price: {
                type: "string"
              },
              photo: {
                type: "string"
              },
              category: {
                type: "object",
                properties: {
                  id: {
                    type: "number"
                  }
                }
              },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number"
                    }
                  }
                }
              },
              tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number"
                    }
                  }
                }
              }
            }
          }
        }
      },
      pagination: {
        type: "object",
        properties: {
          totalItems: { type: "integer", description: "Total number of items" },
          currentPage: { type: "integer", description: "Current page" },
          totalPages: { type: "integer", description: "Total number of pages" },
          nextPage: { type: "integer", description: "Next page number" },
          prevPage: { type: "integer", description: "Previous page number" }
        }
      }
    }
  }
};
var postOptionsDishRoutes = {
  description: "This route creates a new dish",
  tags: ["dishes"],
  body: {
    type: "object",
    properties: {
      name: {
        type: "string"
      },
      description: {
        type: "string"
      },
      price: {
        type: "string"
      },
      photo: {
        type: "string"
      }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid"
        },
        name: {
          type: "string"
        },
        description: {
          type: "string"
        },
        price: {
          type: "string"
        },
        photo: {
          type: "string"
        }
      }
    }
  }
};

// src/http/routes/dishes/dish.route.ts
async function dishesRoutes(app2) {
  app2.get(
    "/dishes",
    {
      schema: getAllOptionsDishRoutes
    },
    allDishes
  );
  app2.get(
    "/dish/:id",
    // {
    //     schema: getOneOptionsDishRoutes,
    // },
    listByName
  );
  app2.post(
    "/create-dish",
    {
      onRequest: [verifyJwt],
      schema: postOptionsDishRoutes
    },
    createDish
  );
}

// src/config/swagger.config.ts
var tagsOptions = (option) => ({
  name: option,
  description: `${option} related end-points`
});
var swaggerOptions = {
  swagger: {
    info: {
      title: "RESTful API using Fastify - Food explorer",
      description: "CRUDs using Swagger, Fastify and Prisma.",
      version: "1.0.0"
    },
    host: "localhost",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      tagsOptions("Users"),
      tagsOptions("Dishes"),
      tagsOptions("Categories")
    ]
  }
};
var swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true
};

// src/utils/errors/fastify-under-pressure.ts
var FastifyUnderPressureError = class _FastifyUnderPressureError extends Error {
  constructor() {
    super("Under pressure!");
    Error.captureStackTrace(
      this,
      _FastifyUnderPressureError
    );
  }
};

// src/config/fastifyUnderPressure.config.ts
var fastifyUnderPressureOptions = {
  maxEventLoopDelay: 1e3,
  maxHeapUsedBytes: 1e8,
  maxRssBytes: 1e8,
  maxEventLoopUtilization: 0.98,
  customError: FastifyUnderPressureError,
  retryAfter: 50
};

// src/app.ts
var app = (0, import_fastify.default)(
  /* { logger: true } */
);
app.register(import_jwt.default, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false
  },
  sign: {
    expiresIn: "10m"
  }
});
app.register(import_under_pressure.default, fastifyUnderPressureOptions);
app.register(import_helmet.default, {
  global: true,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "validator.swagger.io"],
      scriptSrc: ["'self'", "https:", "unpkg.com"]
    }
  }
});
app.register(import_swagger.default, swaggerOptions);
app.register(import_swagger_ui.default, swaggerUiOptions);
app.register(import_cookie.default);
app.register(usersRoutes);
app.register(dishesRoutes);
app.setErrorHandler((error, _, reply) => {
  if (error instanceof import_zod5.ZodError) {
    return reply.status(import_http_status9.default.BAD_REQUEST).send({ message: "Validation error.", issues: error.format() });
  }
  return reply.status(500).send({ message: "Internal server error." });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
