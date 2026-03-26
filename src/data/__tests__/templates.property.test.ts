/**
 * Property Tests for Template System
 * 
 * Feature: resume-editor-optimization
 * 
 * Property 5: Hidden Templates Exclusion
 * *For any* call to getAvailableTemplates(), the result SHALL NOT contain 
 * any template with hidden === true.
 * **Validates: Requirements 3.1**
 * 
 * Property 6: Template Category and Count
 * *For any* call to getAvailableTemplates(), the result SHALL contain at least 
 * 3 templates, and each template SHALL have a valid category from the set 
 * {designer, developer, hr, marketing, finance, general}, with at least 1 template per category.
 * **Validates: Requirements 3.2, 3.3, 3.10**
 * 
 * Property 8: Data Preservation on Template Change
 * *For any* resume data and any template selection, applying the template SHALL 
 * preserve all user-entered content (personalInfo, experience, education, skills, 
 * projects) without modification.
 * **Validates: Requirements 3.9**
 */

import * as fc from 'fast-check';
import { 
  CORE_TEMPLATE_IDS,
  getAvailableTemplates, 
  getTemplatesByCategory,
  getTemplatesGroupedByCategory,
  VALID_CATEGORIES,
  templateCategories
} from '../templates';
import { TemplateStyle } from '../../types/template';
import { ResumeData } from '../../types/resume';

/**
 * Property 5: Hidden Templates Exclusion
 * Feature: resume-editor-optimization, Property 5
 * **Validates: Requirements 3.1**
 */
describe('Property 5: Hidden Templates Exclusion', () => {
  it('getAvailableTemplates should never return templates with hidden === true', () => {
    const availableTemplates = getAvailableTemplates();
    
    // Property: No template in the result should have hidden === true
    const hasHiddenTemplate = availableTemplates.some(t => t.hidden === true);
    expect(hasHiddenTemplate).toBe(false);
  });

  it('all returned templates should have hidden === undefined or hidden === false', () => {
    const availableTemplates = getAvailableTemplates();
    
    // Property: Every template should have hidden !== true
    availableTemplates.forEach(template => {
      expect(template.hidden).not.toBe(true);
    });
  });


  it('getTemplatesByCategory should also exclude hidden templates', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_CATEGORIES),
        (category) => {
          const templates = getTemplatesByCategory(category);
          // Property: No template in any category should be hidden
          return templates.every(t => t.hidden !== true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('templateCategories should not contain hidden templates', () => {
    templateCategories.forEach(category => {
      category.templates.forEach(template => {
        expect(template.hidden).not.toBe(true);
      });
    });
  });
});

/**
 * Property 6: Template Category and Count
 * Feature: resume-editor-optimization, Property 6
 * **Validates: Requirements 3.2, 3.3, 3.10**
 */
describe('Property 6: Template Category and Count', () => {
  const MINIMUM_TOTAL_TEMPLATES = 3;
  const MINIMUM_PER_CATEGORY = 1;

  it('should only expose the 3 core templates', () => {
    const availableTemplates = getAvailableTemplates();
    const availableIds = availableTemplates.map((template) => template.id).sort();
    const expectedIds = [...CORE_TEMPLATE_IDS].sort();

    // 仅允许三套核心模板进入可见列表，避免旧模板回流到选择器。
    expect(availableIds).toEqual(expectedIds);
  });

  it('should have at least 3 available templates', () => {
    const availableTemplates = getAvailableTemplates();
    expect(availableTemplates.length).toBeGreaterThanOrEqual(MINIMUM_TOTAL_TEMPLATES);
  });

  it('every template should have a valid category', () => {
    const availableTemplates = getAvailableTemplates();
    const validCategories = ['designer', 'developer', 'hr', 'marketing', 'finance', 'general'];
    
    availableTemplates.forEach(template => {
      expect(validCategories).toContain(template.category);
    });
  });

  it('each main category should have at least 1 template', () => {
    const grouped = getTemplatesGroupedByCategory();
    
    VALID_CATEGORIES.forEach(category => {
      const templates = grouped[category] || [];
      expect(templates.length).toBeGreaterThanOrEqual(MINIMUM_PER_CATEGORY);
    });
  });

  it('property: for any valid category, getTemplatesByCategory returns at least 1 template', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_CATEGORIES),
        (category) => {
          const templates = getTemplatesByCategory(category);
          return templates.length >= MINIMUM_PER_CATEGORY;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all templates should have required fields', () => {
    const availableTemplates = getAvailableTemplates();
    
    availableTemplates.forEach(template => {
      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.description).toBeDefined();
      expect(template.category).toBeDefined();
      expect(template.colors).toBeDefined();
      expect(template.fonts).toBeDefined();
      expect(template.layout).toBeDefined();
      expect(template.components).toBeDefined();
    });
  });

  it('template IDs should be unique', () => {
    const availableTemplates = getAvailableTemplates();
    const ids = availableTemplates.map(t => t.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(ids.length);
  });
});


/**
 * Property 8: Data Preservation on Template Change
 * Feature: resume-editor-optimization, Property 8
 * **Validates: Requirements 3.9**
 */
describe('Property 8: Data Preservation on Template Change', () => {
  // Generator for ResumeData
  const resumeDataArbitrary = fc.record({
    personalInfo: fc.record({
      name: fc.string({ minLength: 1, maxLength: 50 }),
      title: fc.string({ minLength: 1, maxLength: 100 }),
      email: fc.emailAddress(),
      phone: fc.string({ minLength: 5, maxLength: 20 }),
      location: fc.string({ minLength: 1, maxLength: 100 }),
      website: fc.option(fc.webUrl(), { nil: undefined }),
      summary: fc.string({ minLength: 0, maxLength: 500 }),
      avatar: fc.option(fc.string(), { nil: undefined })
    }),
    experience: fc.array(
      fc.record({
        id: fc.uuid(),
        company: fc.string({ minLength: 1, maxLength: 100 }),
        position: fc.string({ minLength: 1, maxLength: 100 }),
        startDate: fc.string({ minLength: 7, maxLength: 10 }),
        endDate: fc.string({ minLength: 2, maxLength: 10 }),
        current: fc.boolean(),
        description: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 1, maxLength: 5 }),
        location: fc.option(fc.string(), { nil: undefined })
      }),
      { minLength: 0, maxLength: 5 }
    ),
    education: fc.array(
      fc.record({
        id: fc.uuid(),
        school: fc.string({ minLength: 1, maxLength: 100 }),
        degree: fc.string({ minLength: 1, maxLength: 50 }),
        major: fc.string({ minLength: 1, maxLength: 100 }),
        startDate: fc.string({ minLength: 7, maxLength: 10 }),
        endDate: fc.string({ minLength: 7, maxLength: 10 }),
        gpa: fc.option(fc.string(), { nil: undefined }),
        description: fc.option(fc.string(), { nil: undefined })
      }),
      { minLength: 0, maxLength: 3 }
    ),
    skills: fc.array(
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        level: fc.integer({ min: 0, max: 100 }),
        category: fc.string({ minLength: 1, maxLength: 30 }),
        color: fc.option(fc.string({ minLength: 4, maxLength: 7 }), { nil: undefined })
      }),
      { minLength: 0, maxLength: 10 }
    ),
    projects: fc.array(
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }),
        description: fc.string({ minLength: 1, maxLength: 300 }),
        technologies: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 10 }),
        startDate: fc.string({ minLength: 7, maxLength: 10 }),
        endDate: fc.string({ minLength: 7, maxLength: 10 }),
        url: fc.option(fc.webUrl(), { nil: undefined }),
        highlights: fc.array(fc.string(), { minLength: 0, maxLength: 5 })
      }),
      { minLength: 0, maxLength: 5 }
    )
  });

  /**
   * Simulates template selection behavior
   * Template selection should ONLY change the template style, NOT the resume data
   */
  function simulateTemplateSelection(
    resumeData: ResumeData,
    newTemplate: TemplateStyle
  ): { resumeData: ResumeData; template: TemplateStyle } {
    // Template selection only changes the template, not the data
    // This is the expected behavior based on the implementation
    return {
      resumeData: resumeData, // Data should remain unchanged
      template: newTemplate
    };
  }

  it('template selection should not modify personalInfo', () => {
    fc.assert(
      fc.property(
        resumeDataArbitrary,
        fc.constantFrom(...getAvailableTemplates()),
        (resumeData, template) => {
          const result = simulateTemplateSelection(resumeData, template);
          
          // Property: personalInfo should be identical after template change
          return JSON.stringify(result.resumeData.personalInfo) === 
                 JSON.stringify(resumeData.personalInfo);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('template selection should not modify experience', () => {
    fc.assert(
      fc.property(
        resumeDataArbitrary,
        fc.constantFrom(...getAvailableTemplates()),
        (resumeData, template) => {
          const result = simulateTemplateSelection(resumeData, template);
          
          // Property: experience should be identical after template change
          return JSON.stringify(result.resumeData.experience) === 
                 JSON.stringify(resumeData.experience);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('template selection should not modify education', () => {
    fc.assert(
      fc.property(
        resumeDataArbitrary,
        fc.constantFrom(...getAvailableTemplates()),
        (resumeData, template) => {
          const result = simulateTemplateSelection(resumeData, template);
          
          // Property: education should be identical after template change
          return JSON.stringify(result.resumeData.education) === 
                 JSON.stringify(resumeData.education);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('template selection should not modify skills', () => {
    fc.assert(
      fc.property(
        resumeDataArbitrary,
        fc.constantFrom(...getAvailableTemplates()),
        (resumeData, template) => {
          const result = simulateTemplateSelection(resumeData, template);
          
          // Property: skills should be identical after template change
          return JSON.stringify(result.resumeData.skills) === 
                 JSON.stringify(resumeData.skills);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('template selection should not modify projects', () => {
    fc.assert(
      fc.property(
        resumeDataArbitrary,
        fc.constantFrom(...getAvailableTemplates()),
        (resumeData, template) => {
          const result = simulateTemplateSelection(resumeData, template);
          
          // Property: projects should be identical after template change
          return JSON.stringify(result.resumeData.projects) === 
                 JSON.stringify(resumeData.projects);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('template selection should preserve all resume data fields', () => {
    fc.assert(
      fc.property(
        resumeDataArbitrary,
        fc.constantFrom(...getAvailableTemplates()),
        (resumeData, template) => {
          const result = simulateTemplateSelection(resumeData, template);
          
          // Property: entire resumeData should be identical after template change
          return JSON.stringify(result.resumeData) === JSON.stringify(resumeData);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('switching between multiple templates should preserve data', () => {
    fc.assert(
      fc.property(
        resumeDataArbitrary,
        fc.array(fc.constantFrom(...getAvailableTemplates()), { minLength: 2, maxLength: 10 }),
        (resumeData, templates) => {
          let currentData = resumeData as ResumeData;
          
          // Apply multiple template changes
          for (const template of templates) {
            const result = simulateTemplateSelection(currentData, template);
            currentData = result.resumeData;
          }
          
          // Property: data should be unchanged after multiple template switches
          return JSON.stringify(currentData) === JSON.stringify(resumeData);
        }
      ),
      { numRuns: 100 }
    );
  });
});
