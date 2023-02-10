import { getCoordinatesByAddress } from "helpers/utils";
import fetch from "node-fetch";

jest.mock("node-fetch", () =>
  jest.fn().mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      result: [
        {
          address_components: [{ long_name: "denmark", short_name: "denmark", types: ["country"] }],
          formatted_address: "denmark",
          geometry: {
            location: { lat: 56.23008005, lng: 11.54250005 },
            location_type: "APPROXIMATE",
            viewport: { northeast: { lat: 56.23008005, lng: 11.54250005 }, southwest: { lat: 56.23008005, lng: 11.54250005 } },
          },
          place_id: "",
          plus_code: {},
          types: ["locality", "political"],
        },
      ],
      status: "OK",
    }),
  }),
);
describe("Utils", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("getCoordinatesByAddress", () => {
    it("should return coordinates", async () => {
      // act
      const result = await getCoordinatesByAddress("test-address");
      // assert
      expect(fetch).toBeCalledWith(expect.any(String));
      expect(result).toBe("56.23008005,11.54250005");
    });
  });
});

