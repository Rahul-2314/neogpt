import User from "../models/User.js";
import { PLAN_LIMITS } from "../config.js";

const tokenLimitMiddleware = async (req, res, next) => {
	try {
		const user = await User.findOne({ username: req.username });
		if (!user) return res.status(401).json({ msg: "User not found" });

		const now = new Date();
		const resetAt = new Date(user.tokensResetAt);
		const monthPassed =
			now.getFullYear() > resetAt.getFullYear() ||
			now.getMonth() > resetAt.getMonth();

		if (monthPassed) {
			user.tokensUsed = 0;
			user.tokensResetAt = now;
			await user.save();
		}

		const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;

		if (user.tokensUsed >= limit) {
			return res.status(403).json({
				msg: "Monthly token limit reached. Upgrade your plan to continue.",
				tokensUsed: user.tokensUsed,
				limit,
			});
		}

		req.user = user;
		next();
	} catch (err) {
		console.error("TokenLimit error:", err.message);
		res.status(500).json({ msg: "Internal Server Error" });
	}
};

export default tokenLimitMiddleware;
