"use client";

import IDEWorkspace from "@/components/ide/IDEWorkspace";
import LiveAnimationBackground from "@/components/ui/LiveAnimationBackground";
import ShaderBackground from "@/components/ui/ShaderBackground";
import { ExtensionsProvider } from "@/hooks/useExtensions";

export default function HomeClient({
  sectionOrder,
  aboutContent,
  experienceContent,
  skillsContent,
  projectsContent,
  educationContent,
  awardsContent,
  publicationContent,
  galleryContent,
  clubingContent,
  mentorshipContent,
  contactContent,
  uiExtensions,
}) {
  return (
    <ExtensionsProvider siteDefaults={uiExtensions}>
      <ShaderBackground />
      <LiveAnimationBackground />
      <IDEWorkspace
        sectionOrder={sectionOrder}
        aboutContent={aboutContent}
        experienceContent={experienceContent}
        skillsContent={skillsContent}
        projectsContent={projectsContent}
        educationContent={educationContent}
        awardsContent={awardsContent}
        publicationContent={publicationContent}
        galleryContent={galleryContent}
        clubingContent={clubingContent}
        mentorshipContent={mentorshipContent}
        contactContent={contactContent}
      />
    </ExtensionsProvider>
  );
}
