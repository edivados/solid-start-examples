import { client } from "~/lib/prisma/client";

try {
  await client.counter.create({ data: { id: 1, count: 0 } });
}
catch(error) {
  console.error(error);
}
finally {
  await client.$disconnect();
}
