/**
 * Request validation middleware helper using Joi schemas.
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true, // Allow fields like token or cookie payload values
    });

    if (error) {
      console.log("[VALIDATION ERROR DETAILS]:", error.details);
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Validation failed: " + errorMessages.join(", "),
        errors: errorMessages,
      });
    }

    next();
  };
};
