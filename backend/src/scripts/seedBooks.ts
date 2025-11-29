import { prisma } from "../src/config/db.js";
import { catalogBooks } from "../src/utils/mockData.js";

const main = async () => {
	console.log("Seeding books and courses...");

	// Upsert courses
	const courseTitles = Array.from(new Set(catalogBooks.map((b) => b.course)));
	const courseMap: Record<string, string> = {};
	for (const title of courseTitles) {
		const course = await prisma.course.upsert({
			where: { title },
			update: {},
			create: { title, description: `${title} course` },
		});
		courseMap[title] = course.id;
	}

	for (const book of catalogBooks) {
		await prisma.book.upsert({
			where: { isbn: book.isbn },
			update: {
				title: book.title,
				price: book.price,
				condition: book.isUsed ? "USED" : "NEW",
				courseId: courseMap[book.course],
			},
			create: {
				title: book.title,
				isbn: book.isbn,
				price: book.price,
				condition: book.isUsed ? "USED" : "NEW",
				courseId: courseMap[book.course],
			},
		});
	}

	console.log("Seeding done.");
};

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
