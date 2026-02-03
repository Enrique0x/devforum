// Question model
type Question = {
  title: string;
  body: string;
  userId: string;
  categoryId: string;
  createdAt: Date;
};

module.exports = Question;
