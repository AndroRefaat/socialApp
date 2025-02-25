export const validation = (schema) => {
    return (resolver) => {
        return async (parent, args, context) => {

            const error = schema.validate(args, { abortEarly: false });
            if (error.error) {
                const messageList = error.error.details.map(err => err.message);
                throw new Error(messageList.join(', '), { cause: 400 });
            }
            return resolver(parent, args, context);
        }


    }



}