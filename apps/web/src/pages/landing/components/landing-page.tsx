import { FeatureSection } from './feature-section';
import { HeroSection } from './hero-section';
import { RoadmapSection } from './roadmap-section';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <RoadmapSection />
    </>
  );
}
