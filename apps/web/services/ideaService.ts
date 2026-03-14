import api from "./api";

const addIdea = async (ideaData: any) => {
  try {
    // بما أن api.post تعيد البيانات مباشرة، لا حاجة لـ .data
    return await api.post("/ideas", ideaData);
  } catch (err: any) {
    console.error("Error adding idea:", err);
    // مع fetch، الخطأ يكون هو كائن الخطأ نفسه أو نص الرسالة
    throw err || { message: "Failed to submit idea" };
  }
};

const getMyIdeas = async () => {
  return await api.get("/my-ideas");
};

const updateIdea = async (ideaId: string, ideaData: any) => {
  try {
    return await api.put(`/ideas/${ideaId}`, ideaData);
  } catch (err: any) {
    console.error("Error updating idea:", err);
    throw err || { message: "Failed to update idea" };
  }
};

export default { addIdea, updateIdea, getMyIdeas };