import request from "supertest";
import { ObjectId } from "mongodb";
import { app } from "../../src/app";
import { SETTINGS } from "../../src/settings";
import { usersCollection } from "../../src/cloud_DB";

export const testManager = {
  async createUser() {
    const newUser = {
      login: "Tina",
      password: "tina123",
      email: "Tina@gmail.com",
    };

    await request(app)
      .post(SETTINGS.PATH.USERS)
      .send(newUser)
      .auth("admin", "qwerty")
      .expect(201);

    return newUser;
  },

  async loginUser() {
    const loginInput = {
      loginOrEmail: "Tina@gmail.com",
      password: "tina123",
    };

    const res = await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send(loginInput)
      .expect(200);

    const cookies = res.headers["set-cookie"];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

    const refreshToken = cookieArray
      .find((cookie: string) => cookie.startsWith("refreshToken="))
      .split(";")[0]
      .split("=")[1];

    return { res, refreshToken };
  },

  async getUser() {
    const res = await request(app)
      .get(SETTINGS.PATH.USERS)
      .auth("admin", "qwerty");
    return res.body;
  },

  async registerUser() {
    const newUser = {
      login: "Tina",
      password: "tina123",
      email: "Tina@gmail.com",
    };

    await request(app)
      .post(`${SETTINGS.PATH.AUTH}/registration`)
      .send(newUser)
      .expect(204);
  },

  async getConfirmCode() {
    await this.registerUser();

    const user = await this.getUser();
    const userWithCode = await usersCollection.findOne({
      _id: new ObjectId(user.items[0].id),
    });

    return userWithCode
      ? userWithCode.emailConfirmation.confirmationCode
      : null;
  },

  async createBlog() {
    const newBlog = {
      name: "Promise",
      description: "do you know promise?",
      websiteUrl: "https://google.com",
    };

    const res = await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .send(newBlog)
      .auth("admin", "qwerty")
      .expect(201);

    return res.body;
  },

  async getBlogs() {
    const res = await request(app).get(SETTINGS.PATH.BLOGS).expect(200);
    return res.body.items;
  },

  async createPost(blogId: string) {
    const newPost = {
      title: "Memo",
      shortDescription: "Learn more about memo in " + new Date(),
      content: "whole content about memo",
    };

    const res = await request(app)
      .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .send(newPost)
      .auth("admin", "qwerty")
      .expect(201);

    return res.body;
  },

  async createComment(postId: string, accessToken: string) {
    const comment = {
      content: "Can you, please, explain how it works?",
    };

    const res = await request(app)
      .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
      .send(comment)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(201);
    return res.body;
  },
};
