import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import * as postService from "./post.service.graphql.js";
import { onePostRequest } from "./types/post.types.request.js";
import { allPostsResponse, onePostResponse } from "./types/post.types.response.js";
import { isAuthenticated } from '../../../graphql/authentication.js';
import { allMiddleware } from "../../../graphql/allfunctions.js";
import { validation } from "../../../graphql/validation.js";
import { postSchema } from "./post.graphql.validation.js";


export const postQuery = {
    onePost: {
        type: new GraphQLObjectType({
            name: "onePost",
            fields: {
                success: { type: GraphQLBoolean },
                status: { type: GraphQLInt },
                results: { type: onePostResponse }
            }
        }),
        args: onePostRequest,
        resolve: allMiddleware(
            postService.onePost,
            validation(postSchema),
            isAuthenticated(['admin']),
        )
    },
    allPosts: {
        type: new GraphQLObjectType({
            name: "AllPosts",
            fields: {
                success: { type: GraphQLBoolean },
                status: { type: GraphQLInt },
                results: { type: allPostsResponse }
            }
        }),
        resolve: isAuthenticated(postService.allPosts)
    }
}