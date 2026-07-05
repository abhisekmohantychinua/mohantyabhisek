import { beforeEach, describe, expect, test, vi } from "vitest";

import { getMongoDb } from "@/lib/mongodb";

import { getBlogMetadataBySlug } from "./blog-metadata-service";

const findOneMock = vi.fn();
const collectionMock = vi.fn();

vi.mock("@/lib/mongodb", () => ({
  getMongoDb: vi.fn(),
}));

describe("get-blog-metadata-by-slug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBlogMetadataBySlug", () => {
    test("returns blog metadata when a matching document exists", async () => {
      const doc = {
        slug: "my-blog-post",
        title: "My Blog Post",
        description: "Blog description",
      };

      findOneMock.mockResolvedValue(doc);

      collectionMock.mockReturnValue({
        findOne: findOneMock,
      });

      vi.mocked(getMongoDb).mockResolvedValue({
        collection: collectionMock,
      } as never);

      const result = await getBlogMetadataBySlug("my-blog-post");

      expect(collectionMock).toHaveBeenCalledWith("blogmetadatas");

      expect(findOneMock).toHaveBeenCalledWith(
        { slug: "my-blog-post" },
        {
          projection: {
            _id: 0,
            slug: 1,
            title: 1,
            description: 1,
          },
        },
      );

      expect(result).toEqual({
        slug: "my-blog-post",
        title: "My Blog Post",
        description: "Blog description",
      });
    });

    test("returns null when no document exists", async () => {
      findOneMock.mockResolvedValue(null);

      collectionMock.mockReturnValue({
        findOne: findOneMock,
      });

      vi.mocked(getMongoDb).mockResolvedValue({
        collection: collectionMock,
      } as never);

      const result = await getBlogMetadataBySlug("missing-slug");

      expect(result).toBeNull();
    });

    test("queries the database using the provided slug", async () => {
      findOneMock.mockResolvedValue(null);

      collectionMock.mockReturnValue({
        findOne: findOneMock,
      });

      vi.mocked(getMongoDb).mockResolvedValue({
        collection: collectionMock,
      } as never);

      await getBlogMetadataBySlug("custom-slug");

      expect(findOneMock).toHaveBeenCalledWith(
        { slug: "custom-slug" },
        expect.any(Object),
      );
    });
  });
});
