import { revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'

const productOptions = [
  { label: 'Monolith 65 Keyboard', value: '1' },
  { label: 'Solāre Studio Headphones', value: '2' },
  { label: 'Field Study Hoodie', value: '3' },
  { label: 'Transit Puffer 01', value: '4' },
  { label: 'Arc One Field Watch', value: '5' },
  { label: 'Stone Air Speaker', value: '6' },
]

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'productKey', 'reviewerName', 'rating', 'status', 'createdAt'],
    group: 'Commerce',
  },
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: 'approved' } }),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && !req.user) {
          data.status = 'pending'
          data.verified = false
        }
        return data
      },
    ],
    afterChange: [
      ({ req }) => {
        if (!req.context.skipReviewRevalidation) revalidateTag('reviews', 'max')
      },
    ],
    afterDelete: [
      ({ req }) => {
        if (!req.context.skipReviewRevalidation) revalidateTag('reviews', 'max')
      },
    ],
  },
  fields: [
    {
      name: 'productKey',
      label: 'Product',
      type: 'select',
      options: productOptions,
      required: true,
      index: true,
    },
    {
      name: 'reviewerName',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 60,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      validate: (value) =>
        !value || value.length <= 120 || 'Email addresses must be 120 characters or fewer.',
      access: {
        read: ({ req }) => Boolean(req.user),
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 90,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      minLength: 20,
      maxLength: 1200,
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
