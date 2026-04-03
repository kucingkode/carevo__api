import type { UpdateUserProftoBody, UpdateCvBody } from "@carevo/contracts/api";
import { faker } from "@faker-js/faker";

export function randomProfto(): UpdateUserProftoBody {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    summary: faker.lorem.paragraph(),
    lastEducation: faker.lorem.sentence(),
    professionRole: faker.helpers.arrayElement([
      "Product Manager / Project Manager",
      "UI/UX Designer & Researcher",
      "Front-End (FE) Developer",
      "Back-End (BE) Developer & Database Administrator",
      "Data Analyst & Business Intelligence (BI)",
      "Cybersecurity Analyst",
      "Business Analyst / ERP Consultant",
      "IT Governance & Risk Specialist",
      "Cloud & Infrastructure Engineer",
      "Machine Learning Engineer / AI Specialist",
    ]),
  };
}

export function randomCv(): UpdateCvBody {
  return {
    certifications: faker.helpers.multiple(() => ({
      name: faker.lorem.sentence(),
      publisher: faker.company.name(),
      certificateNumber: faker.string.alphanumeric(),
      publishDate: faker.date.recent().toISOString().split("T")[0],
      verificationUrl: faker.internet.url(),
    })),
    courses: faker.helpers.multiple(() => ({
      name: faker.lorem.sentence(),
      organizer: faker.company.name(),
      description: faker.lorem.paragraph(),
      location: faker.location.city(),
      url: faker.internet.url(),
      startYear: faker.number.int({ min: 2000, max: 2015 }),
      endYear: faker.helpers.maybe(() =>
        faker.number.int({ min: 2016, max: 2025 }),
      ),
    })),
    educations: faker.helpers.multiple(() => ({
      educationLevel: faker.helpers.arrayElement([
        "SD",
        "SMP",
        "MTS",
        "SMA",
        "MA",
        "SMK",
        "Profesi",
        "D3",
        "D4",
        "S1",
        "S2",
        "S3",
      ]),
      city: faker.location.city(),
      description: faker.lorem.paragraph(),
      score: faker.number.int({ min: 0, max: 100 }),
      maxScale: 100,
      studyProgram: faker.lorem.words(),
      institution: faker.company.name(),
      startYear: faker.number.int({ min: 2000, max: 2015 }),
      endYear: faker.helpers.maybe(() =>
        faker.number.int({ min: 2016, max: 2025 }),
      ),
    })),
    organizations: faker.helpers.multiple(() => ({
      organizationName: faker.company.name(),
      position: faker.person.jobType(),
      city: faker.location.city(),
      description: faker.lorem.paragraph(),
      startYear: faker.number.int({ min: 2000, max: 2015 }),
      endYear: faker.helpers.maybe(() =>
        faker.number.int({ min: 2016, max: 2025 }),
      ),
    })),
    personalInformation: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      profile: faker.lorem.paragraph(),
      websiteUrl: faker.internet.url(),
    },
    skills: faker.helpers.multiple(() => ({
      name: faker.lorem.words(),
      score: faker.number.int({ min: 1, max: 5 }),
    })),
    workExperiences: faker.helpers.multiple(() => ({
      companyName: faker.company.name(),
      position: faker.person.jobTitle(),
      city: faker.location.city(),
      description: faker.lorem.paragraph(),
      employmentStatus: faker.helpers.arrayElement([
        "Pegawai Tetap",
        "Pegawai Kontrak",
        "Pegawai Magang",
        "Freelance",
        "Paruh Waktu",
      ]),
      startYear: faker.number.int({ min: 2000, max: 2015 }),
      endYear: faker.helpers.maybe(() =>
        faker.number.int({ min: 2016, max: 2025 }),
      ),
    })),
  };
}
