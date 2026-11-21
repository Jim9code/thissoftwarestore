import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

const catalog: Record<string, { name: string; price: number }> = {
  '1': { name: 'Monolith 65 Keyboard', price: 340 },
  '2': { name: 'Solāre Studio Headphones', price: 420 },
  '3': { name: 'Field Study Hoodie', price: 185 },
  '4': { name: 'Transit Puffer 01', price: 149 },
  '5': { name: 'Arc One Field Watch', price: 265 },
  '6': { name: 'Stone Air Speaker', price: 295 },
}

const secureOrder: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation !== 'create' || req.user) return data

  const rawItems = Array.isArray(data.items) ? data.items : []
  data.items = rawItems.map((item) => {
    const product = catalog[String(item.productKey)]
    const quantity = Math.max(1, Math.min(10, Number(item.quantity) || 1))
    if (!product) throw new Error('One or more cart items are not available.')
    return {
      productKey: String(item.productKey),
      name: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    }
  })

  data.subtotal = data.items.reduce(
    (total: number, item: { lineTotal: number }) => total + item.lineTotal,
    0,
  )
  data.shippingTotal = data.deliveryMethod === 'express' ? 24 : data.subtotal >= 200 ? 0 : 12
  data.total = data.subtotal + data.shippingTotal
  data.status = 'received'
  data.orderNumber = `FF-${Date.now().toString(36).toUpperCase()}`
  return data
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerEmail', 'total', 'status', 'createdAt'],
    group: 'Commerce',
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [secureOrder],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'received',
      options: ['received', 'processing', 'shipped', 'cancelled'],
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      validate: (value) =>
        !value || value.length <= 120 || 'Email addresses must be 120 characters or fewer.',
    },
    {
      name: 'shipping',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text', required: true, maxLength: 60 },
        { name: 'lastName', type: 'text', required: true, maxLength: 60 },
        { name: 'address', type: 'text', required: true, maxLength: 120 },
        { name: 'apartment', type: 'text', maxLength: 80 },
        { name: 'city', type: 'text', required: true, maxLength: 80 },
        { name: 'region', type: 'text', required: true, maxLength: 80 },
        { name: 'postalCode', type: 'text', required: true, maxLength: 20 },
        {
          name: 'country',
          type: 'select',
          required: true,
          options: ['United States', 'Canada', 'United Kingdom'],
        },
      ],
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      required: true,
      options: ['standard', 'express'],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: ['card'],
    },
    { name: 'paymentLast4', type: 'text', required: true, minLength: 4, maxLength: 4 },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 30,
      fields: [
        { name: 'productKey', type: 'text', required: true },
        {
          name: 'name',
          type: 'text',
          required: true,
          access: { create: ({ req }) => Boolean(req.user) },
        },
        { name: 'quantity', type: 'number', required: true, min: 1, max: 10 },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          access: { create: ({ req }) => Boolean(req.user) },
        },
        {
          name: 'lineTotal',
          type: 'number',
          required: true,
          access: { create: ({ req }) => Boolean(req.user) },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      access: { create: ({ req }) => Boolean(req.user) },
    },
    {
      name: 'shippingTotal',
      type: 'number',
      required: true,
      access: { create: ({ req }) => Boolean(req.user) },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      access: { create: ({ req }) => Boolean(req.user) },
    },
  ],
}
