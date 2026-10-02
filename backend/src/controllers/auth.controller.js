const authService = require("../services/auth.service");

const setTokenCookies = (res, accessToken, refreshToken) => {
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    };

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        setTokenCookies(res, result.accessToken, result.refreshToken);

        return res.status(201).json({
            status: "success",
            data: { user: result.user },
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        setTokenCookies(res, result.accessToken, result.refreshToken);

        return res.status(200).json({
            status: "success",
            data: { user: result.user },
        });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        await authService.logout(refreshToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({
            status: "success",
            message: "Успешный выход из системы",
        });
    } catch (err) {
        next(err);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const result = await authService.refresh(refreshToken);
        setTokenCookies(res, result.accessToken, result.refreshToken);

        return res.status(200).json({
            status: "success",
            data: { user: result.user },
        });
    } catch (err) {
        next(err);
    }
};

const me = async (req, res, next) => {
    try {
        const user = await authService.verifyMe(req.user.userId);

        return res.status(200).json({
            status: "success",
            data: { user },
        });
    } catch (err) {
        next(err);
    }
};

const banAndRevokeTokens = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const result = await authService.revokeUserTokens(userId);

        res.status(200).json({
            status: "success",
            message: `Все сессии пользователя успешно аннулированы. Отозвано токенов: ${result.revokedCount}`,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    logout,
    refresh,
    me,
    banAndRevokeTokens,
};
