import { homeSchema } from "../../server/src/services/home/home.schema";

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const formatTopics = (data) =>
  data
    .map((d: homeSchema) => ({
      ...d,
      name: toTitleCase(d.name),
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
