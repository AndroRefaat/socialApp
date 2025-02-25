import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { imageType } from "../../../../utils/graphql/images.types.js";
import { oneUserResponse } from "../../../user/graphql/user.types.response.js";

export const onePostResponse = new GraphQLObjectType({
    name: "OnePost",
    fields: {
        text: { type: GraphQLString },
        images: {
            type: new GraphQLList(imageType)
        },
        user: { type: oneUserResponse },
        likes: { type: new GraphQLList(GraphQLID) },
        isDeleted: { type: GraphQLBoolean },
        deletedBy: { type: GraphQLID },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }
})


export const allPostsResponse = new GraphQLList(onePostResponse)








