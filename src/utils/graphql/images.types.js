import { GraphQLString, GraphQLObjectType } from "graphql";

export const imageType = new GraphQLObjectType({
    name: "Image",
    fields: {
        secure_url: { type: GraphQLString },
        public_id: { type: GraphQLString }
    }
})