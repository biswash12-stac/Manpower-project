"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Admin.ts
var mongoose_1 = require("mongoose");
var bcryptjs_1 = require("bcryptjs");
var AdminSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin',
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
var hashPassword = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var salt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcryptjs_1.default.genSalt(12)];
            case 1:
                salt = _a.sent();
                return [2 /*return*/, bcryptjs_1.default.hash(password, salt)];
        }
    });
}); };
// Hash password before saving
AdminSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!this.isModified('password'))
                        return [2 /*return*/];
                    _a = this;
                    return [4 /*yield*/, hashPassword(this.password)];
                case 1:
                    _a.password = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
function hashPasswordInUpdate() {
    return __awaiter(this, void 0, void 0, function () {
        var update, directPassword, setUpdate, setPassword, passwordToHash, hashedPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    update = this.getUpdate();
                    if (!update || Array.isArray(update))
                        return [2 /*return*/];
                    directPassword = typeof update.password === 'string' ? update.password : undefined;
                    setUpdate = update.$set;
                    setPassword = typeof (setUpdate === null || setUpdate === void 0 ? void 0 : setUpdate.password) === 'string' ? setUpdate.password : undefined;
                    passwordToHash = directPassword !== null && directPassword !== void 0 ? directPassword : setPassword;
                    if (!passwordToHash)
                        return [2 /*return*/];
                    return [4 /*yield*/, hashPassword(passwordToHash)];
                case 1:
                    hashedPassword = _a.sent();
                    if (directPassword) {
                        update.password = hashedPassword;
                    }
                    if (setPassword) {
                        update.$set = __assign(__assign({}, setUpdate), { password: hashedPassword });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
AdminSchema.pre('findOneAndUpdate', hashPasswordInUpdate);
AdminSchema.pre('findByIdAndUpdate', hashPasswordInUpdate);
AdminSchema.pre('updateOne', hashPasswordInUpdate);
AdminSchema.pre('updateMany', hashPasswordInUpdate);
AdminSchema.set('toJSON', {
    transform: function (_doc, ret) {
        delete ret.password;
        return ret;
    },
});
// Compare password method
AdminSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!this.password)
                return [2 /*return*/, false];
            return [2 /*return*/, bcryptjs_1.default.compare(candidatePassword, this.password)];
        });
    });
};
// Indexes for performance
AdminSchema.index({ email: 1 });
AdminSchema.index({ isActive: 1 });
exports.default = mongoose_1.default.models.Admin || mongoose_1.default.model('Admin', AdminSchema);
