// Fulfills Section 7 and Section 9 (Resume Templates & ATS Output)

export const renderTemplate = (data: any, templateId: string): string => {
  const { personalInfo = {}, experience = [], summary = '' } = data;
  
  // Semantic HTML, clear hierarchy, machine-readable text for ATS
  if (templateId === 'ats-classic') {
    return `
      <div style="font-family: serif; max-width: 800px; margin: 0 auto; color: #000;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 5px;">${personalInfo.name || 'Your Name'}</h1>
        <p style="text-align: center; font-size: 14px; margin-bottom: 20px;">
          ${personalInfo.email || 'email@example.com'} | ${personalInfo.phone || 'Phone'} | ${personalInfo.location || 'Location'}
        </p>
        
        <h2 style="border-bottom: 1px solid #000; font-size: 16px; margin-top: 20px; padding-bottom: 3px;">PROFESSIONAL SUMMARY</h2>
        <p style="font-size: 14px; line-height: 1.5;">${summary}</p>
        
        <h2 style="border-bottom: 1px solid #000; font-size: 16px; margin-top: 20px; padding-bottom: 3px;">EXPERIENCE</h2>
        ${experience.map((exp: any) => `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px;">
              <span>${exp.title || 'Job Title'} - ${exp.company || 'Company'}</span>
              <span>${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</span>
            </div>
            <p style="font-size: 14px; margin-top: 5px; line-height: 1.5;">${exp.description || 'Description...'}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Modern Professional Template
  return `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #333;">
      <div style="background-color: #f8fafc; padding: 30px; border-left: 5px solid #2563eb; margin-bottom: 25px;">
        <h1 style="font-size: 32px; color: #1e293b; margin: 0 0 10px 0;">${personalInfo.name || 'Your Name'}</h1>
        <p style="color: #64748b; font-size: 14px; margin: 0;">
          ${personalInfo.email || 'Email'} &bull; ${personalInfo.phone || 'Phone'} &bull; ${personalInfo.location || 'Location'}
        </p>
      </div>
      
      <div style="padding: 0 30px;">
        <h2 style="color: #2563eb; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Summary</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">${summary}</p>
        
        <h2 style="color: #2563eb; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; margin-top: 30px; margin-bottom: 15px;">Experience</h2>
        ${experience.map((exp: any) => `
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0; font-size: 16px; color: #1e293b;">${exp.title || 'Role'}</h3>
            <p style="margin: 2px 0 8px 0; color: #64748b; font-size: 14px; font-weight: bold;">${exp.company || 'Company'} | ${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">${exp.description || 'Description'}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};
