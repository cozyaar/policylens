import { pgTable, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { PolicyFeatures, ScoreDimension, Loophole, ProfileFit, PairingOption } from '../data/policies';

export const policiesTable = pgTable('policies', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  insurer: text('insurer').notNull(),
  insurerLogo: text('insurer_logo').notNull(),
  planType: text('plan_type').notNull(),
  category: text('category').notNull(),
  overallScore: integer('overall_score').notNull(),
  tagline: text('tagline').notNull(),
  highlights: jsonb('highlights').$type<string[]>().notNull(),
  dimensions: jsonb('dimensions').$type<ScoreDimension[]>().notNull(),
  features: jsonb('features').$type<PolicyFeatures>().notNull(),
  loopholes: jsonb('loopholes').$type<Loophole[]>().notNull(),
  profileFit: jsonb('profile_fit').$type<ProfileFit>().notNull(),
  alternatives: jsonb('alternatives').$type<string[]>().notNull(),
  pairings: jsonb('pairings').$type<PairingOption[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
