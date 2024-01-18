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

// src/http/routes/users/user.route.ts
var user_route_exports = {};
__export(user_route_exports, {
  usersRoutes: () => usersRoutes
});
module.exports = __toCommonJS(user_route_exports);

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

// src/lib/prisma.ts
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
    console.log(userWithSameEmail);
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
async function usersRoutes(app) {
  app.post("/users", register);
  app.post("/sessions", authenticate);
  app.patch("/token/refresh", refresh);
  app.get("/me", { onRequest: [verifyJwt] }, profile);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usersRoutes
});
