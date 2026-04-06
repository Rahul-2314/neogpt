import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new mongoose.Schema(
	{
		fullname: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		language: { type: String, required: true, default: "English" },

		premium: { type: Boolean, default: false },
		apiKey: { type: String, default: null },

		plan: {
			type: String,
			enum: ["free", "pro", "premium", "premium_plus"],
			default: "free",
		},
		tokensUsed: { type: Number, default: 0 },
		tokensResetAt: { type: Date, default: () => new Date() },
	},
	{ timestamps: true },
);

UserSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}

	if (this.premium && !this.apiKey) {
		let uniqueApiKey;
		let collisionDetected = true;
		while (collisionDetected) {
			uniqueApiKey = uuidv4();
			const existing = await mongoose
				.model("User")
				.findOne({ apiKey: uniqueApiKey });
			if (!existing) collisionDetected = false;
		}
		this.apiKey = uniqueApiKey;
	}

	if (this.isModified("premium") && this.premium && this.plan === "free") {
		this.plan = "pro";
	}

	next();
});

export default mongoose.model("User", UserSchema);
