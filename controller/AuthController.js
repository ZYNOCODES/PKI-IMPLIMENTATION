const {Op} = require('sequelize');
const validator = require('validator');
const Profile = require('../model/ProfileModel.js');
const Role = require('../model/RoleModel.js');
const Region = require('../model/RegionModel.js');
const Wilaya = require('../model/WilayaModel.js');
const CustomError = require('../util/CustomError.js');
const path = require("path");
const fs = require("fs");
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const {
    createToken
} = require('../util/JWT.js');
const {
    comparePassword,
    hashPassword
} = require('../util/bcrypt.js');

const _findUserByUsername = async (identifier) => {
    return await Profile.findOne({
        where: {
            username: identifier
        }
    });
};

const _findUserByPhone = async (identifier) => {
    return await Profile.findOne({
        where: {
            phone: identifier
        }
    });
};

const login = asyncErrorHandler(async (req, res, next) => {
    const {
        identifier,
        password
    } = req.verifiedData;
    
    // Check if the identifier and password are provided
    if (!identifier || !password || 
        validator.isEmpty(identifier.toString()) || validator.isEmpty(password.toString())
    ) {
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }

    // Check if the user exists
    let existingProfile;
    if (validator.isMobilePhone(identifier, 'ar-DZ')) {
        existingProfile = await _findUserByPhone(identifier);
    }else if(validator.isAlphanumeric(identifier)){
        existingProfile = await _findUserByUsername(identifier);
    }
    if (!existingProfile) {
        return next(new CustomError('Identifiant ou mot de passe invalide', 400));
    }

    // Check if the password is correct
    const isMatch = await comparePassword(password, existingProfile.password);
    if (!isMatch) {
        return next(new CustomError('Invalid username or password', 400));
    }

    // Check if the user is validated
    if (!existingProfile.validation) {
        return next(new CustomError('Le compte n\'est pas encore validé', 400));
    }
    // Create a token
    const token = createToken(existingProfile.id, existingProfile.role, existingProfile.region);
    res.status(200).json({
        status: true,
        token
    });
});

const register = asyncErrorHandler(async (req, res, next) => {
    const {
        username,
        fullname,
        phone,
        password,
        role,
        region,
        wilaya
    } = req.verifiedData;
    // Check if the required fields are provided
    if (!username || !fullname || !phone || !password || !role) {
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }
    // Check if the phone number is valid
    if (!validator.isMobilePhone(phone, 'ar-DZ')) {
        return next(new CustomError('Numéro de téléphone invalide', 400));
    }
    //check if the region is valid
    if (region && !validator.isEmpty(region)) {
        const existingRegion = await Region.findOne({
            where: {
                id: region
            }
        });
        if (!existingRegion) {
            return next(new CustomError('Région invalide', 400));
        }
    }
    //check if the wilaya is valid
    if (wilaya && !validator.isEmpty(wilaya)) {
        const existingWilaya = await Wilaya.findOne({
            where: {
                id: wilaya
            }
        });
        if (!existingWilaya) {
            return next(new CustomError('Wilaya invalide', 400));
        }
    }
    //check if the role is valid
    const existingRole = await Role.findOne({
        where: {
            id: role
        }
    });
    if (!existingRole) {
        return next(new CustomError('Role invalide', 400));
    }

    // Check if the user already exists with the same phone number or username
    const existingProfile = await Profile.findOne({
        where: {
            [Op.or]: [{
                phone: phone
            }, {
                username: username
            }]
        }
    });
    if (existingProfile) {
        return next(new CustomError('L\'utilisateur existe déjà', 400)); 
    }
    // Hash the password
    const hashedPassword = await hashPassword(password);
    // Create a new user
    await Profile.create({
        username,
        fullname,
        phone,
        password: hashedPassword,
        role: existingRole.id,
        region: region ? region : null,
        wilaya: wilaya ? wilaya : null,
    });
    res.status(200).json({
        status: true,
        message: 'Utilisateur créé avec succès'
    });
});

const getPrivateKey = asyncErrorHandler(async (req, res, next) => {
    const PRIVATE_KEY_PATH = path.join(__dirname, "../keys", "private.key");
    //check if the private key exists
    if (!fs.existsSync(PRIVATE_KEY_PATH)) {
        return next(new CustomError('Private key not found', 400));
    }
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
    //check if the private key exists
    if (!privateKey) {
        return next(new CustomError('Private key not found', 400));
    }
    res.status(200).json({
        status: true,
        privateKey
    });
});

module.exports = {
    login,
    register,
    getPrivateKey
};
