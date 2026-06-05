// Shared constants — safe to import in both server and client components

export type Subcategory = 'design' | 'mechanical' | 'electrical' | 'software' | 'business' | 'media' | 'scouting' | 'miscellaneous'

export const SUBCATEGORIES: Subcategory[] = [
  'design', 'mechanical', 'electrical', 'software',
  'business', 'media', 'scouting', 'miscellaneous',
]

export const MINICATEGORIES: Record<Subcategory, string[]> = {
  design:        ['CAD', 'Prototyping', 'Ergonomics', 'Aesthetics'],
  mechanical:    ['Drivetrain', 'Intake', 'Shooter', 'Climber', 'Arm', 'Elevator', 'Bumpers'],
  electrical:    ['Wiring', 'Power', 'Sensors', 'Motors', 'Pneumatics'],
  software:      ['Autonomous', 'Teleop', 'Vision', 'Controls', 'Simulation'],
  business:      ['Impact', 'Outreach', 'Fundraising', 'Sustainability'],
  media:         ['Photography', 'Video', 'Social Media', 'Branding'],
  scouting:      ['Match Scouting', 'Pit Scouting', 'Data Analysis', 'Strategy', 'Alliance Selection'],
  miscellaneous: ['Superpit', 'How to Start a Team', 'Safety'],
}
