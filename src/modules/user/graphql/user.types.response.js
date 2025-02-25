import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { imageType } from "../../../utils/graphql/images.types.js";

export const oneUserResponse = new GraphQLObjectType({
    name: "OneUser",
    fields: {
        email: { type: GraphQLString },
        userName: { type: GraphQLString },
        profilePicture: { type: imageType },
        _id: { type: GraphQLID }
    }
})