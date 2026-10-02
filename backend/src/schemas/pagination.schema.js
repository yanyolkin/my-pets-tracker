const { z } = require('zod');

const paginationQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    type: z.string().optional(),
    breed: z.string().optional(),
  }),
});

module.exports = { paginationQuerySchema };
