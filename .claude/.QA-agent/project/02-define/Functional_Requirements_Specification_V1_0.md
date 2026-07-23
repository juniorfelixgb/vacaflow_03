**Functional Requirements Specification**

**Project:** NEXA **Document ID:** FRS-001 **Stage:** 02 ---
Define **Author:** Andrea Bermudez Bazurto (AI
Assisted) **PO/BSA:** Andrea Bermudez Bazurto **Related
SI:** SI-001 **Date:** 2026-06-19 **Version:** 1.0 **Status:** Draft

**1. System Overview**

**1.1 Purpose**

NEXA is an internally built, self-service journey automation platform
designed to replace the SenseHQ communication engine at InspyrSolutions.
The system enables Marketing, Recruiting, and HR business users to
create, configure, and operate automated multi-channel communications
(SMS and Email) across candidate and employee lifecycles --- without
dependency on technical teams. NEXA delivers dynamic audience
segmentation, country- and language-specific compliance enforcement,
time-zone-aware scheduling, reusable template management, survey
collection, and centralized reporting. It eliminates the journey
duplication, reliability failures, and recurring licensing costs
associated with the current SenseHQ implementation, and must be
operational by September 2026 to meet the organization\'s formal product
commitment.

**1.2 Scope**

NEXA MVP covers the creation and management of journeys, audiences,
surveys, templates, and reports; automated SMS and Email delivery via
Twilio and SendGrid; a read-only integration with JobDiva for candidate
and employee data; an administrative dashboard; and error management
with retry mechanisms. The platform is built on React/Next.js
(frontend), .NET 10 microservices (backend), Azure API Management, and
Azure SQL Database. Historical data migration from SenseHQ, additional
communication channels (WhatsApp, voice, chat), write-back to JobDiva,
AI/LLM capabilities, and export functionality are explicitly excluded
from MVP.

**1.3 Definitions**

  -----------------------------------------------------------------------
  **Term**       **Definition**
  -------------- --------------------------------------------------------
  Journey        An automated workflow that defines a sequence of
                 communications and actions triggered by business events
                 for a target audience

  Audience       A dynamically defined group of recipients (candidates or
                 employees) selected by configurable segmentation rules

  Segment        A subset of an audience defined by one or more filter
                 criteria (country, language, business rule, etc.)

  Template       A reusable content definition for SMS or Email
                 communications, stored in the central repository

  Survey         A structured set of questions associated with a journey
                 or sent independently to collect recipient responses

  Channel        A communication delivery method; for MVP: SMS (via
                 Twilio) and Email (via SendGrid)

  Journey        A single execution of a journey for a specific recipient
  Instance       within a specific audience

  Activation     The action of enabling a journey, audience, or survey so
                 it becomes available for execution

  Deactivation   The action of disabling a journey, audience, or survey
                 so it stops executing without deletion

  Retry          An automatic re-attempt to deliver a failed
                 communication after a configurable delay

  APIM           Azure API Management --- the gateway through which all
                 frontend-to-backend communication is routed

  JobDiva        The external Applicant Tracking System (ATS) that serves
                 as the system of record for candidate and employee data

  JobDiva        The dedicated backend service responsible for all read
  Adapter        interactions with JobDiva; no other service may connect
  Service        to JobDiva directly

  RBAC           Role-Based Access Control --- the authorization model
                 governing user permissions within NEXA

  MVP            Minimum Viable Product --- the September 2026 release
                 scope defined in SI-001

  SenseHQ        The current CRM and communication platform being
                 replaced by NEXA
  -----------------------------------------------------------------------

**2. User Roles & Personas**

  --------------------------------------------------------------------------------------
  **Role   **Role Name**   **Description**                                    **Access
  ID**                                                                        Level**
  -------- --------------- -------------------------------------------------- ----------
  UR-01    Administrator   Platform administrator responsible for system      Admin
                           configuration, user management, and operational    
                           oversight. Has full access to all modules.         

  UR-02    Business User   Marketing, Recruiting, or HR team member who       Read /
                           creates and manages journeys, audiences, surveys,  Write
                           templates, and reports. Primary day-to-day user.   

  UR-03    Candidate       External recipient of journey communications (SMS  External
                           and Email). Interacts with the system only through (no login)
                           delivered communications and survey responses; has 
                           no platform login.                                 

  UR-04    Employee        Internal recipient of journey communications (SMS  External
                           and Email). Interacts with the system only through (no login)
                           delivered communications and survey responses; has 
                           no platform login.                                 
  --------------------------------------------------------------------------------------

*Note: UR-03 and UR-04 (Candidates and Employees) are communication
recipients only; they do not log into or interact with the NEXA platform
UI directly. The system is designed to support additional user groups in
future versions beyond the two recipient groups defined for MVP. All
platform-facing roles defined for MVP are UR-01 and UR-02.*

**3. Functional Requirements**

*Requirements are grouped by feature/module. Format: FR-\[Feature
Code\]-\[###\] Priority: Must Have \| Should Have \| Won\'t v1*

**3.1 Journey Management**

**Feature Description:** Allows Business Users and Administrators to
create, configure, activate, deactivate, and manage automated
communication journeys. Each journey defines the sequence of steps,
branching logic, channel assignments, target audience, scheduling rules,
country/language settings, recurrence, and triggering conditions that
govern how and when communications are delivered to recipients.

  -----------------------------------------------------------------------------------------
  **ID**      **Requirement**                                  **Priority**   **Notes**
  ----------- ------------------------------------------------ -------------- -------------
  FR-JM-001   The system shall allow Business Users to create  Must Have      
              a new journey by providing a name, description,                 
              target audience, channel assignments, and                       
              scheduling configuration.                                       

  FR-JM-002   The system shall allow Business Users to edit an Must Have      Editing a
              existing journey\'s name, description, audience                 live journey
              assignment, channel assignments, scheduling, and                must follow
              step configuration.                                             activation
                                                                              rules

  FR-JM-003   The system shall allow Business Users to delete  Must Have      Active
              a journey that is in an inactive state.                         journeys must
                                                                              be
                                                                              deactivated
                                                                              before
                                                                              deletion

  FR-JM-004   The system shall allow Business Users to         Must Have      
              duplicate an existing journey, creating an                      
              independent copy with a new name.                               

  FR-JM-005   The system shall allow Business Users to         Must Have      
              activate a journey, making it eligible for                      
              execution.                                                      

  FR-JM-006   The system shall allow Business Users to         Must Have      
              deactivate an active journey, halting new                       
              executions while preserving history.                            

  FR-JM-007   The system shall allow Business Users to apply a Must Have      
              pre-defined template to a new or existing                       
              journey.                                                        

  FR-JM-008   The system shall allow Business Users to save a  Must Have      
              journey as a reusable template in the central                   
              repository.                                                     

  FR-JM-009   The system shall display all journeys in a main  Must Have      
              grid with columns for name, status, audience,                   
              channel, last modified date, and created by.                    

  FR-JM-010   The system shall allow Business Users to search  Must Have      
              journeys by name or keyword in the main grid.                   

  FR-JM-011   The system shall allow Business Users to sort    Must Have      
              journeys by name, status, creation date, and                    
              last modified date in the main grid.                            

  FR-JM-012   The system shall allow Business Users to filter  Must Have      
              journeys by status (active, inactive, draft),                   
              channel, audience, and country in the main grid.                

  FR-JM-013   The system shall allow Business Users to perform Must Have      Bulk delete
              bulk edit and bulk delete operations on selected                only for
              journeys in the main grid.                                      inactive
                                                                              journeys

  FR-JM-014   The system shall allow Business Users to         Must Have      Ties to
              configure scheduling rules for a journey,                       BR-003
              including start date, end date, recurrence                      
              pattern, and recipient local time-zone offset.                  

  FR-JM-015   The system shall allow Business Users to         Must Have      Ties to
              configure country-specific rules per journey,                   BR-001,
              including applicable compliance settings and                    BR-004
              language.                                                       

  FR-JM-016   The system shall maintain a full execution       Must Have      
              history log per journey, recording each instance                
              triggered, recipient, channel, timestamp,                       
              delivery status, and outcome.                                   

  FR-JM-017   The system shall provide a visual flow editor    Must Have      OSS library
              for building and editing the step sequence and                  selection per
              branching logic of a journey, using an approved                 SI-001
              OSS canvas library (React Flow, Rete.js, or                     constraints
              JointJS core).                                                  

  FR-JM-018   The system shall persist the journey flow        Must Have      
              definition --- nodes, edges, positions, step                    
              properties, name, and priority --- in a                         
              versioned, auditable form independent of the                    
              canvas library.                                                 

  FR-JM-019   The system shall allow Business Users to         Should Have    Ties to
              configure error handling and retry settings per                 BR-006
              journey step.                                                   

  FR-JM-020   The system shall restrict deletion of an active  Must Have      
              journey, displaying an error message and                        
              requiring deactivation first.                                   
  -----------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-JM-001:**

-   Given a Business User is on the Journey Management screen, when they
    select \"Add Journey\" and complete all required fields (name,
    audience, at least one channel, scheduling rule), then the system
    creates the journey in draft status and displays it in the main
    grid.

-   Given a Business User submits a new journey without a required
    field, when the form is validated, then the system displays an
    inline error message identifying the missing field and does not
    create the journey.

**FR-JM-003:**

-   Given a journey is in inactive status, when a Business User selects
    \"Delete\" and confirms the action, then the system permanently
    removes the journey and its configuration from the main grid.

-   Given a journey is in active status, when a Business User attempts
    to delete it, then the system displays an error message stating the
    journey must be deactivated before deletion.

**FR-JM-005:**

-   Given a journey is in draft or inactive status and all required
    configuration is complete, when a Business User selects
    \"Activate\", then the system transitions the journey to active
    status and begins scheduling executions per the defined rules.

-   Given a journey is missing required scheduling or audience
    configuration, when a Business User attempts to activate it, then
    the system displays a validation error listing the missing
    configuration.

**FR-JM-014:**

-   Given a Business User configures a journey with a scheduled time of
    09:00 and a recipient located in a UTC-5 time zone, when the journey
    executes, then the communication is delivered at 09:00 local time
    for that recipient.

**FR-JM-016:**

-   Given a journey has executed at least one instance, when a Business
    User opens the journey\'s execution history, then the system
    displays a list of all triggered instances with recipient, channel,
    timestamp, and delivery outcome.

**FR-JM-017:**

-   Given a Business User opens the visual journey editor, when they
    drag a step node onto the canvas and connect it to an existing node,
    then the system renders the connection and persists the updated flow
    definition on save.

**3.2 Audience Management**

**Feature Description:** Allows Business Users and Administrators to
create, configure, and manage audiences --- dynamically defined groups
of candidates or employees used as recipients for journeys and
communications. Audiences are built using configurable segmentation
rules including country, language, and business-specific criteria.
Audience segments support real-time inclusion and exclusion of recipient
groups.

  ----------------------------------------------------------------------------------------
  **ID**      **Requirement**                            **Priority**   **Notes**
  ----------- ------------------------------------------ -------------- ------------------
  FR-AM-001   The system shall allow Business Users to   Must Have      
              create a new audience by providing a name,                
              description, and at least one segmentation                
              rule.                                                     

  FR-AM-002   The system shall allow Business Users to   Must Have      
              edit an existing audience\'s name,                        
              description, and segmentation rules.                      

  FR-AM-003   The system shall allow Business Users to   Must Have      
              delete an audience that is not assigned to                
              any active journey.                                       

  FR-AM-004   The system shall allow Business Users to   Must Have      
              duplicate an existing audience, creating                  
              an independent copy with a new name.                      

  FR-AM-005   The system shall allow Business Users to   Must Have      
              activate an audience, making it available                 
              for assignment to journeys.                               

  FR-AM-006   The system shall allow Business Users to   Must Have      
              deactivate an audience, preventing new                    
              assignments while preserving existing                     
              journey associations.                                     

  FR-AM-007   The system shall allow Business Users to   Must Have      
              apply a pre-defined audience template.                    

  FR-AM-008   The system shall display all audiences in  Must Have      
              a main grid with columns for name, status,                
              segment count, associated journeys, last                  
              modified date, and created by.                            

  FR-AM-009   The system shall allow Business Users to   Must Have      
              search audiences by name or keyword in the                
              main grid.                                                

  FR-AM-010   The system shall allow Business Users to   Must Have      
              sort audiences by name, status, creation                  
              date, and last modified date in the main                  
              grid.                                                     

  FR-AM-011   The system shall allow Business Users to   Must Have      
              filter audiences by status, country, and                  
              language in the main grid.                                

  FR-AM-012   The system shall allow Business Users to   Must Have      Bulk delete only
              perform bulk edit and bulk delete                         for audiences not
              operations on selected audiences in the                   assigned to active
              main grid.                                                journeys

  FR-AM-013   The system shall support dynamic inclusion Must Have      Ties to BR-002
              of recipient segments based on                            
              configurable rules (country, language,                    
              business rules).                                          

  FR-AM-014   The system shall support dynamic exclusion Must Have      Ties to BR-003
              of specific recipient segments or                         
              individual recipients from an audience.                   

  FR-AM-015   The system shall allow Business Users to   Must Have      Ties to BR-002
              configure audience segmentation rules by                  
              country, filtering recipients by their                    
              country of record sourced from JobDiva.                   

  FR-AM-016   The system shall allow Business Users to   Must Have      Ties to BR-004
              configure audience segmentation rules by                  
              language preference.                                      

  FR-AM-017   The system shall allow Business Users to   Must Have      User lists are in
              create and manage user lists as named,                    scope per SI-001
              manually curated subsets of recipients                    v5.0
              that can be assigned to an audience.                      

  FR-AM-018   The system shall allow Business Users to   Must Have      
              add, edit, and remove recipients from a                   
              user list.                                                

  FR-AM-019   The system shall allow Business Users to   Should Have    Import format TBD
              import recipients into a user list.                       during development

  FR-AM-020   The system shall restrict deletion of an   Must Have      
              audience assigned to at least one active                  
              journey, displaying an error message and                  
              requiring journey deactivation or                         
              re-assignment first.                                      
  ----------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-AM-001:**

-   Given a Business User is on the Audience Management screen, when
    they select \"Add Audience\" and provide a name and at least one
    segmentation rule, then the system creates the audience in draft
    status and displays it in the main grid.

-   Given a Business User submits a new audience without a segmentation
    rule, when the form is validated, then the system displays an inline
    error message and does not create the audience.

**FR-AM-013:**

-   Given an audience is configured with a segmentation rule for country
    = \"US\" and language = \"English\", when the system evaluates the
    eligible recipient pool from JobDiva, then only recipients matching
    both criteria are included in the audience.

**FR-AM-014:**

-   Given an audience includes a specific recipient segment, when a
    Business User adds an exclusion rule for that segment, then the
    excluded recipients are removed from the audience\'s active
    recipient list and no longer receive communications for journeys
    using that audience.

**FR-AM-017:**

-   Given a Business User navigates to Audience Management, when they
    create a new user list and assign it to an audience, then the
    recipients in the user list are included in the audience\'s
    recipient evaluation.

**3.3 Survey Management**

**Feature Description:** Allows Business Users and Administrators to
create, configure, and manage surveys --- structured sets of questions
that can be associated with journeys or sent independently. Surveys
support activation, deactivation, duplication, and template management,
and are delivered to candidates and employees as part of automated
journey flows or on-demand.

  -----------------------------------------------------------------------------------------
  **ID**      **Requirement**                            **Priority**   **Notes**
  ----------- ------------------------------------------ -------------- -------------------
  FR-SM-001   The system shall allow Business Users to   Must Have      
              create a new survey by providing a name,                  
              description, and at least one question.                   

  FR-SM-002   The system shall allow Business Users to   Must Have      Editing a live
              edit an existing survey\'s name,                          survey must require
              description, and questions.                               deactivation or
                                                                        versioning

  FR-SM-003   The system shall allow Business Users to   Must Have      
              duplicate an existing survey, creating an                 
              independent copy with a new name.                         

  FR-SM-004   The system shall allow Business Users to   Must Have      
              apply a pre-defined survey template.                      

  FR-SM-005   The system shall allow Business Users to   Must Have      
              delete a survey that is not assigned to                   
              any active journey.                                       

  FR-SM-006   The system shall allow Business Users to   Must Have      
              activate a survey, making it available for                
              association with journeys or independent                  
              delivery.                                                 

  FR-SM-007   The system shall allow Business Users to   Must Have      
              deactivate a survey, preventing new                       
              deliveries while preserving response                      
              history.                                                  

  FR-SM-008   The system shall display all surveys in a  Must Have      
              main grid with columns for name, status,                  
              question count, associated journeys, last                 
              modified date, and created by.                            

  FR-SM-009   The system shall allow Business Users to   Must Have      
              search surveys by name or keyword in the                  
              main grid.                                                

  FR-SM-010   The system shall allow Business Users to   Must Have      
              sort surveys by name, status, creation                    
              date, and last modified date in the main                  
              grid.                                                     

  FR-SM-011   The system shall allow Business Users to   Must Have      
              filter surveys by status and associated                   
              journey in the main grid.                                 

  FR-SM-012   The system shall allow Business Users to   Must Have      Bulk delete only
              perform bulk edit and bulk delete                         for surveys not
              operations on selected surveys in the main                assigned to active
              grid.                                                     journeys

  FR-SM-013   The system shall allow Business Users to   Must Have      
              associate a survey with one or more                       
              journey steps.                                            

  FR-SM-014   The system shall capture and store survey  Must Have      
              responses submitted by recipients, linked                 
              to the recipient\'s identity and the                      
              associated journey instance.                              

  FR-SM-015   The system shall support survey question   Must Have      Additional types
              types including: single-choice,                           may be added
              multiple-choice, and free-text.                           post-MVP

  FR-SM-016   The system shall restrict deletion of a    Must Have      
              survey assigned to at least one active                    
              journey, displaying an error message.                     
  -----------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-SM-001:**

-   Given a Business User is on the Survey Management screen, when they
    select \"Add Survey\", provide a name and add at least one question
    with a defined type, then the system creates the survey in draft
    status and displays it in the main grid.

-   Given a Business User submits a new survey without any questions,
    when the form is validated, then the system displays an inline error
    message and does not create the survey.

**FR-SM-006:**

-   Given a survey is in draft or inactive status and has at least one
    question, when a Business User selects \"Activate\", then the system
    transitions the survey to active status and makes it available for
    journey association.

**FR-SM-014:**

-   Given a survey is active and associated with a journey step, when a
    recipient submits a response, then the system stores the response
    linked to the recipient\'s identity, the survey ID, and the journey
    instance ID, and the response is retrievable in the reporting
    module.

**3.4 Administrative Dashboard**

**Feature Description:** Provides Business Users and Administrators with
a centralized operational view of key platform metrics and communication
activity. The dashboard surfaces real-time and historical data about
journey execution, delivery performance, and system health. Specific
metric definitions and layouts will be confirmed with Milgrim Bello and
Amanda Hilsenbeck before the Requirements phase closes.

  ----------------------------------------------------------------------------------------
  **ID**      **Requirement**                               **Priority**   **Notes**
  ----------- --------------------------------------------- -------------- ---------------
  FR-AD-001   The system shall provide an administrative    Must Have      
              dashboard as the default landing screen after                
              login.                                                       

  FR-AD-002   The system shall display on the dashboard a   Must Have      
              summary count of active journeys, active                     
              audiences, and active surveys.                               

  FR-AD-003   The system shall display on the dashboard the Must Have      
              total number of communications sent (SMS and                 
              Email) for the current day, current week, and                
              current month, broken down by channel.                       

  FR-AD-004   The system shall display on the dashboard a   Must Have      
              delivery success rate for SMS and Email                      
              communications over the current period.                      

  FR-AD-005   The system shall display on the dashboard a   Must Have      
              count of failed deliveries and pending                       
              retries in the current period.                               

  FR-AD-006   The system shall display on the dashboard a   Should Have    
              list of the most recently triggered journey                  
              instances with status (delivered, failed,                    
              pending).                                                    

  FR-AD-007   The system shall allow Business Users to      Should Have    
              filter dashboard metrics by date range,                      
              channel, and country.                                        

  FR-AD-008   The system shall refresh dashboard data       Should Have    Interval to be
              automatically at a configurable interval                     defined during
              without requiring a manual page reload.                      Architecture
                                                                           phase
  ----------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-AD-003:**

-   Given the dashboard is loaded by a Business User, when
    communications have been sent in the current day, then the dashboard
    displays the correct count of SMS and Email messages sent that day,
    week, and month, sourced from the communication delivery log.

**FR-AD-005:**

-   Given one or more communications have failed delivery in the current
    period, when a Business User views the dashboard, then the count of
    failed deliveries and pending retries is displayed and reflects the
    current state of the error management queue.

**3.5 Reporting**

**Feature Description:** Provides Business Users and Administrators with
the ability to view, generate, and schedule predefined operational and
business reports covering journey execution, audience activity, survey
responses, and communication delivery performance. Report content and
specific layouts will be confirmed with Milgrim Bello and Amanda
Hilsenbeck before the Requirements phase closes.

  ------------------------------------------------------------------------------------------------
  **ID**      **Requirement**                                           **Priority**   **Notes**
  ----------- --------------------------------------------------------- -------------- -----------
  FR-RP-001   The system shall provide a report management screen       Must Have      
              listing all available reports in a main grid.                            

  FR-RP-002   The system shall allow Business Users to generate a       Must Have      
              report on demand by selecting it from the report list and                
              applying filter parameters.                                              

  FR-RP-003   The system shall allow Business Users to schedule a       Should Have    
              report for automatic generation at a defined recurrence                  
              (daily, weekly, monthly).                                                

  FR-RP-004   The system shall display generated report results within  Must Have      
              the platform UI in a structured, tabular format.                         

  FR-RP-005   The system shall allow Business Users to search the       Must Have      
              report list by report name in the main grid.                             

  FR-RP-006   The system shall allow Business Users to sort the report  Must Have      
              list by report name and last generated date in the main                  
              grid.                                                                    

  FR-RP-007   The system shall allow Business Users to filter the       Must Have      
              report list by category (journey, audience, delivery,                    
              survey) in the main grid.                                                

  FR-RP-008   The system shall provide a Journey Execution Report       Must Have      
              showing all journey instances executed within a selected                 
              date range, including journey name, audience, channel,                   
              recipient count, delivered count, failed count, and retry                
              count.                                                                   

  FR-RP-009   The system shall provide a Communication Delivery Report  Must Have      
              showing delivery status (delivered, failed, pending) per                 
              channel for a selected date range, broken down by                        
              country.                                                                 

  FR-RP-010   The system shall provide a Survey Response Report showing Must Have      
              response counts and answer distributions per survey for a                
              selected date range.                                                     

  FR-RP-011   The system shall provide an Audience Activity Report      Should Have    
              showing audience membership changes (inclusions,                         
              exclusions) and associated journey assignments for a                     
              selected date range.                                                     

  FR-RP-012   The system shall retain report generation history,        Must Have      
              recording the report name, generated by, generation                      
              timestamp, and filter parameters applied.                                
  ------------------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-RP-002:**

-   Given a Business User selects a report from the report list and
    provides required filter parameters (e.g., date range), when they
    select \"Generate\", then the system processes the request and
    displays the report results within the platform UI within an
    acceptable response time.

-   Given a Business User selects a report and omits a required filter
    parameter, when they attempt to generate, then the system displays
    an inline validation error identifying the missing parameter.

**FR-RP-003:**

-   Given a Business User selects a report and configures a schedule
    (recurrence, start date, time), when the scheduled time arrives,
    then the system automatically generates the report and stores the
    result in the report generation history.

**FR-RP-008:**

-   Given the Journey Execution Report is generated for a date range in
    which journeys were executed, when the results are displayed, then
    each row corresponds to one journey and shows the correct counts of
    delivered, failed, and retried communications as sourced from the
    execution log.

**3.6 Template and Content Repository**

**Feature Description:** Provides a centralized repository for reusable
assets --- SMS and Email communication templates, journey templates,
audience templates, and survey templates --- that Business Users can
apply across modules. The repository supports create, edit, delete, and
search operations.

  -----------------------------------------------------------------------------------------
  **ID**      **Requirement**                               **Priority**   **Notes**
  ----------- --------------------------------------------- -------------- ----------------
  FR-TR-001   The system shall provide a central repository Must Have      
              screen for browsing and managing all reusable                
              templates.                                                   

  FR-TR-002   The system shall allow Business Users to      Must Have      
              create new SMS and Email communication                       
              templates with a name, subject (Email), body                 
              content, and channel assignment.                             

  FR-TR-003   The system shall allow Business Users to edit Must Have      Editing a
              existing communication templates.                            template used in
                                                                           an active
                                                                           journey must
                                                                           display a
                                                                           warning

  FR-TR-004   The system shall allow Business Users to      Must Have      
              delete communication templates that are not                  
              in use by any active journey.                                

  FR-TR-005   The system shall allow Business Users to      Must Have      
              search templates by name, type (SMS, Email,                  
              journey, audience, survey), and keyword.                     

  FR-TR-006   The system shall support dynamic content      Must Have      
              placeholders in communication templates                      
              (e.g., recipient name, company name, project                 
              name) that are resolved at delivery time                     
              using recipient data from JobDiva.                           

  FR-TR-007   The system shall allow Business Users to      Should Have    
              preview the rendered output of a                             
              communication template with sample data                      
              before publishing it.                                        
  -----------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-TR-002:**

-   Given a Business User creates a new Email template with a name,
    subject, and body containing at least one dynamic placeholder, when
    they save the template, then it appears in the repository with
    status \"available\" and can be applied to a journey.

**FR-TR-006:**

-   Given a communication template includes the
    placeholder **{{recipient.firstName}}**, when the system processes a
    journey instance for a recipient whose first name is \"Maria\", then
    the delivered communication contains \"Maria\" in place of the
    placeholder.

**3.7 Multi-Channel Communication Delivery**

**Feature Description:** Manages the automated delivery of SMS
communications via Twilio and Email communications via SendGrid as part
of journey execution. Delivery is scheduled per recipient local time
zone, enforces country-specific compliance rules, and includes error
handling and retry logic for failed deliveries.

  -----------------------------------------------------------------------------------------
  **ID**      **Requirement**                            **Priority**   **Notes**
  ----------- ------------------------------------------ -------------- -------------------
  FR-CD-001   The system shall deliver SMS               Must Have      Ties to BR-001
              communications via Twilio for all                         
              recipients in countries within the defined                
              SMS coverage scope (US, Europe, Latin                     
              America).                                                 

  FR-CD-002   The system shall deliver Email             Must Have      
              communications via SendGrid.                              

  FR-CD-003   The system shall schedule communication    Must Have      Ties to BR-003
              delivery based on each recipient\'s local                 
              time zone, as configured in the journey                   
              scheduling rules.                                         

  FR-CD-004   The system shall enforce country-specific  Must Have      Ties to BR-004;
              compliance rules at delivery time,                        specific rules per
              including permitted delivery windows,                     country confirmed
              opt-out handling, and content restrictions                with
              applicable to the recipient\'s country.                   Legal/Compliance

  FR-CD-005   The system shall record the delivery       Must Have      
              outcome (delivered, failed, bounced,                      
              opted-out) for every communication attempt                
              in the execution log.                                     

  FR-CD-006   The system shall automatically retry       Must Have      Ties to BR-006
              failed communication deliveries according                 
              to the retry configuration defined for the                
              journey step.                                             

  FR-CD-007   The system shall route all communication   Must Have      Technical
              delivery requests through a channel                       constraint from
              abstraction interface                                     SI-001
              (**IEmailSender**, **ISmsSender**) to                     
              maintain provider independence.                           

  FR-CD-008   The system shall never expose Twilio or    Must Have      Security constraint
              SendGrid credentials to the frontend or                   from SI-001
              commit them to source code; credentials                   
              must be stored in Azure Key Vault.                        

  FR-CD-009   The system shall suppress delivery to      Must Have      Ties to BR-004
              recipients who have opted out of                          
              communications for the applicable channel                 
              and country.                                              

  FR-CD-010   The system shall log all communication     Must Have      ISO 27001
              delivery attempts --- including recipient,                compliance
              channel, timestamp, status, and provider                  
              response --- in a persistent, auditable                   
              execution log.                                            
  -----------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-CD-003:**

-   Given a journey is configured to deliver at 09:00 local time and a
    recipient\'s time zone is UTC-6, when the system processes the
    delivery schedule, then the communication is dispatched at 15:00 UTC
    (09:00 UTC-6 local time) for that recipient.

**FR-CD-006:**

-   Given a communication delivery attempt fails with a transient error
    and the journey step has a retry configuration of 3 attempts at
    30-minute intervals, when the first attempt fails, then the system
    automatically retries delivery up to 3 times at 30-minute intervals
    before marking the instance as failed.

**FR-CD-009:**

-   Given a recipient has opted out of SMS communications for the US,
    when a journey targets that recipient with an SMS step and country =
    \"US\", then the system suppresses the delivery and records the
    outcome as \"opted-out\" in the execution log.

**3.8 JobDiva Integration**

**Feature Description:** Provides read-only access to candidate and
employee data from JobDiva through a dedicated JobDiva Adapter Service.
All audience segmentation, recipient resolution, and dynamic content
substitution rely on data sourced from JobDiva. No data is written back
to JobDiva from NEXA in MVP.

  ------------------------------------------------------------------------------------------
  **ID**      **Requirement**                                 **Priority**   **Notes**
  ----------- ----------------------------------------------- -------------- ---------------
  FR-JD-001   The system shall read candidate and employee    Must Have      Hard
              data from JobDiva exclusively through the                      architectural
              JobDiva Adapter Service; no other backend                      constraint from
              service or the frontend may connect to JobDiva                 SI-001
              directly.                                                      

  FR-JD-002   The system shall support an externalized        Must Have      
              field-mapping configuration between the JobDiva                
              schema and the NEXA internal data model;                       
              mappings must not be hardcoded.                                

  FR-JD-003   The system shall expose candidate and employee  Must Have      
              data consumed from JobDiva to audience                         
              segmentation rules and dynamic template                        
              placeholder resolution.                                        

  FR-JD-004   The system shall never store JobDiva            Must Have      
              credentials, API keys, or PATs in source code                  
              or expose them to the frontend; these must                     
              reside in Azure Key Vault.                                     

  FR-JD-005   The system shall support manual or              Must Have      
              adapter-triggered synchronization with JobDiva                 
              for MVP; real-time incremental sync may be                     
              added post-MVP.                                                
  ------------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-JD-001:**

-   Given the NEXA platform requires candidate data for audience
    evaluation, when the audience segmentation engine runs, then it
    retrieves data only by calling the JobDiva Adapter Service API; no
    direct database or API call to JobDiva is made from any other
    service.

**FR-JD-002:**

-   Given a JobDiva field mapping configuration exists in externalized
    configuration, when the Adapter Service processes a candidate
    record, then it maps JobDiva fields to NEXA internal fields
    according to the configuration file without any hardcoded field
    references.

**3.9 Authentication and Authorization**

**Feature Description:** Controls user access to the NEXA platform
through username/password authentication, JWT-based session management,
and role-based access control (RBAC). Secrets are managed via Azure Key
Vault.

  -----------------------------------------------------------------------------------------
  **ID**      **Requirement**                               **Priority**   **Notes**
  ----------- --------------------------------------------- -------------- ----------------
  FR-AA-001   The system shall authenticate users via a     Must Have      
              username and password login form.                            

  FR-AA-002   The system shall hash and store passwords     Must Have      
              using a secure hashing algorithm; plain-text                 
              password storage is prohibited.                              

  FR-AA-003   The system shall issue a JWT token upon       Must Have      
              successful authentication for use in                         
              subsequent authenticated requests.                           

  FR-AA-004   The system shall enforce session expiration;  Must Have      
              expired tokens must be rejected and the user                 
              prompted to re-authenticate.                                 

  FR-AA-005   The system shall enforce role-based access    Must Have      Role granularity
              control (RBAC), granting or denying access to                to be refined
              platform features based on the authenticated                 during
              user\'s assigned role (Administrator,                        Architecture
              Business User).                                              phase

  FR-AA-006   The system shall prevent access to any        Must Have      
              protected resource or API endpoint without a                 
              valid, unexpired JWT token.                                  

  FR-AA-007   The system shall store all secrets (JWT       Must Have      
              signing keys, provider credentials) in Azure                 
              Key Vault; no secrets may be hardcoded or                    
              stored in the frontend.                                      
  -----------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-AA-001:**

-   Given a user navigates to the NEXA login screen and enters a valid
    username and correct password, when they submit the form, then the
    system authenticates the user, issues a JWT token, and redirects
    them to the administrative dashboard.

-   Given a user enters an incorrect password, when they submit the
    form, then the system displays an authentication error message and
    does not issue a token.

**FR-AA-005:**

-   Given an authenticated user with role Business User attempts to
    access an Administrator-only configuration screen, when the request
    is made, then the system denies access and displays an unauthorized
    access message.

**3.10 Audit and Error Management**

**Feature Description:** Provides system-level logging of key user and
system actions for ISO 27001 compliance, and manages communication
delivery errors through configurable retry mechanisms.

  ----------------------------------------------------------------------------------------
  **ID**      **Requirement**                            **Priority**   **Notes**
  ----------- ------------------------------------------ -------------- ------------------
  FR-EM-001   The system shall log all key user actions  Must Have      ISO 27001
              --- including login, logout, create, edit,                compliance
              delete, activate, deactivate, and sign-off                
              --- with the user identity, timestamp,                    
              action type, and target entity.                           

  FR-EM-002   The system shall log all system-level      Must Have      
              actions --- including journey execution                   
              triggers, communication dispatch, delivery                
              outcomes, and retry attempts --- with                     
              timestamps and outcome codes.                             

  FR-EM-003   The system shall provide Administrators    Must Have      
              with access to an audit log viewer that                   
              supports search and filtering by date                     
              range, user, action type, and entity.                     

  FR-EM-004   The system shall enforce retry logic for   Must Have      Ties to BR-006
              failed communication deliveries per the                   
              configuration defined in FR-JM-019 and                    
              FR-CD-006.                                                

  FR-EM-005   The system shall alert Administrators when Should Have    Threshold and
              a communication delivery failure rate                     alert mechanism to
              exceeds a configurable threshold within a                 be defined during
              defined time window.                                      Architecture phase
  ----------------------------------------------------------------------------------------

**Acceptance Criteria**

**FR-EM-001:**

-   Given an authenticated user performs a \"Delete Journey\" action,
    when the deletion is executed, then the system records an audit log
    entry containing the user\'s identity, the timestamp, the action
    type \"DELETE\", and the journey entity identifier.

**FR-EM-003:**

-   Given an Administrator navigates to the audit log viewer and applies
    a filter for a specific user and date range, when the filter is
    applied, then the system displays only the audit entries matching
    the filter criteria.

**4. Use Cases**

*High-level use cases describing user-system interactions. Format:
UC-\[###\]*

**UC-001: Create and Activate a Journey**

  ----------------------------------------------------------------------------------
  **Field**            **Value**
  -------------------- -------------------------------------------------------------
  **ID**               UC-001

  **Actor**            Business User

  **Goal**             Create a new automated journey and activate it for execution

  **Trigger**          Business User selects \"Add Journey\" from the Journey
                       Management screen

  **Preconditions**    Business User is authenticated; at least one active audience
                       exists; at least one active communication template exists

  **Postconditions**   Journey is active and scheduled for execution per the defined
                       rules
  ----------------------------------------------------------------------------------

**Main Flow:**

1.  Business User selects \"Add Journey\".

2.  System presents the journey creation form.

3.  Business User enters the journey name, description, and selects the
    target audience.

4.  Business User opens the visual journey editor and adds steps
    (communication, wait, branch).

5.  Business User assigns a communication template and channel (SMS or
    Email) to each communication step.

6.  Business User configures scheduling rules (start date, recurrence,
    recipient local time zone).

7.  Business User configures country-specific compliance settings.

8.  Business User saves the journey as draft.

9.  Business User selects \"Activate\".

10. System validates all required configuration is complete.

11. System transitions the journey to active status and confirms
    activation to the user.

**Alternative Flows:**

-   Step 4: Business User selects \"Apply Template\" to pre-populate the
    journey structure from a saved journey template, then proceeds to
    modify as needed.

**Exceptions:**

-   Step 10 --- Missing required field: System displays a validation
    error listing the incomplete configuration; journey remains in draft
    status.

-   Step 6 --- No audience assigned: System prevents activation and
    displays \"An audience must be assigned before activation.\"

**UC-002: Configure Audience with Dynamic Segmentation**

  ----------------------------------------------------------------------------------
  **Field**            **Value**
  -------------------- -------------------------------------------------------------
  **ID**               UC-002

  **Actor**            Business User

  **Goal**             Create an audience with dynamic inclusion and exclusion rules
                       for a specific country and language

  **Trigger**          Business User selects \"Add Audience\" from the Audience
                       Management screen

  **Preconditions**    Business User is authenticated; JobDiva data is available via
                       the Adapter Service

  **Postconditions**   Audience is created with the defined segmentation rules and
                       available for journey assignment
  ----------------------------------------------------------------------------------

**Main Flow:**

1.  Business User selects \"Add Audience\".

2.  System presents the audience creation form.

3.  Business User enters the audience name and description.

4.  Business User adds an inclusion rule: country = \"US\", language =
    \"English\".

5.  Business User adds an exclusion rule to remove a specific recipient
    segment.

6.  System evaluates the rules against the current JobDiva data and
    displays a preview of the resulting recipient count.

7.  Business User saves the audience.

8.  System creates the audience in draft status.

9.  Business User activates the audience.

10. Audience is available for assignment to journeys.

**Alternative Flows:**

-   Step 3: Business User selects \"Apply Template\" to use a
    pre-defined audience configuration.

-   Step 4: Business User adds recipients from a saved user list as an
    inclusion source.

**Exceptions:**

-   Step 6 --- JobDiva data unavailable: System displays a warning that
    the recipient preview cannot be generated but allows the audience to
    be saved.

**UC-003: Create and Associate a Survey with a Journey**

  ---------------------------------------------------------------------------------
  **Field**            **Value**
  -------------------- ------------------------------------------------------------
  **ID**               UC-003

  **Actor**            Business User

  **Goal**             Create a survey and associate it with a specific step in an
                       existing journey

  **Trigger**          Business User navigates to Survey Management and selects
                       \"Add Survey\"

  **Preconditions**    Business User is authenticated; at least one journey exists

  **Postconditions**   Survey is active and associated with the target journey
                       step; responses are captured on delivery
  ---------------------------------------------------------------------------------

**Main Flow:**

1.  Business User selects \"Add Survey\".

2.  System presents the survey creation form.

3.  Business User enters the survey name and description.

4.  Business User adds questions, selecting a type (single-choice,
    multiple-choice, free-text) for each.

5.  Business User saves and activates the survey.

6.  Business User navigates to the target journey and opens the visual
    journey editor.

7.  Business User selects the journey step where the survey should be
    delivered.

8.  Business User associates the active survey with that step.

9.  System saves the updated journey configuration.

**Alternative Flows:**

-   Step 3: Business User selects \"Apply Template\" to use a
    pre-defined survey structure.

**Exceptions:**

-   Step 8 --- Journey is active: System displays a warning that
    modifying an active journey will take effect on the next execution
    cycle; Business User confirms to proceed.

**UC-004: Generate an On-Demand Report**

  ---------------------------------------------------------------------------------
  **Field**            **Value**
  -------------------- ------------------------------------------------------------
  **ID**               UC-004

  **Actor**            Business User

  **Goal**             Generate a Journey Execution Report for a selected date
                       range

  **Trigger**          Business User navigates to the Reporting screen and selects
                       a report

  **Preconditions**    Business User is authenticated; journey execution data
                       exists for the selected period

  **Postconditions**   Report is generated and displayed within the platform;
                       generation is recorded in report history
  ---------------------------------------------------------------------------------

**Main Flow:**

1.  Business User navigates to the Reporting screen.

2.  System displays the report list grid.

3.  Business User selects the \"Journey Execution Report\".

4.  System presents the report filter form (date range, country,
    channel).

5.  Business User enters a date range and selects \"Generate\".

6.  System processes the request against the execution log.

7.  System displays the report results in a structured tabular view
    within the UI.

8.  System records the generation event in the report history.

**Alternative Flows:**

-   Step 3: Business User selects \"Schedule Report\" to configure an
    automatic recurrence instead of on-demand generation.

**Exceptions:**

-   Step 7 --- No data for the selected period: System displays a
    message indicating no execution data was found for the specified
    filters.

-   Step 5 --- Missing required filter: System displays an inline
    validation error.

**UC-005: Review Failed Deliveries and Monitor Retries**

  ----------------------------------------------------------------------------------
  **Field**            **Value**
  -------------------- -------------------------------------------------------------
  **ID**               UC-005

  **Actor**            Administrator

  **Goal**             Identify failed communication deliveries, review retry
                       status, and take corrective action if needed

  **Trigger**          Administrator observes a failed delivery count on the
                       Administrative Dashboard or receives an alert

  **Preconditions**    Administrator is authenticated; at least one communication
                       delivery failure exists in the execution log

  **Postconditions**   Administrator has reviewed failure details; automatic retries
                       are confirmed or manual escalation is initiated
  ----------------------------------------------------------------------------------

**Main Flow:**

1.  Administrator views the Administrative Dashboard and observes the
    failed delivery count.

2.  Administrator navigates to the relevant journey\'s execution
    history.

3.  System displays the list of failed delivery instances with
    recipient, channel, timestamp, error code, and retry status.

4.  Administrator reviews the retry queue --- system shows pending retry
    attempts and their scheduled times.

5.  Administrator confirms the retry configuration is appropriate; no
    manual action required.

6.  System continues to execute retries per the configured schedule.

**Alternative Flows:**

-   Step 5: Administrator identifies that retries are exhausted and the
    failure is unrecoverable --- they escalate the issue to the
    technical team via external channels.

**Exceptions:**

-   Step 3 --- Execution log unavailable: System displays an error and
    the Administrator contacts the technical team.

**UC-006: Manage User List for Audience Targeting**

  --------------------------------------------------------------------------------
  **Field**            **Value**
  -------------------- -----------------------------------------------------------
  **ID**               UC-006

  **Actor**            Business User

  **Goal**             Create a curated user list and assign it as an inclusion
                       source within an audience

  **Trigger**          Business User navigates to Audience Management and selects
                       \"User Lists\"

  **Preconditions**    Business User is authenticated

  **Postconditions**   User list is created and available as an inclusion source
                       for audience configuration
  --------------------------------------------------------------------------------

**Main Flow:**

1.  Business User navigates to Audience Management and opens User Lists.

2.  Business User selects \"Create User List\".

3.  Business User enters a name for the user list.

4.  Business User adds recipients manually or via import.

5.  Business User saves the user list.

6.  Business User opens or creates an audience.

7.  Business User adds the user list as an inclusion source in the
    audience\'s segmentation rules.

8.  System includes the user list recipients in the audience\'s
    evaluated recipient pool.

**Alternative Flows:**

-   Step 4: Business User imports recipients from a structured file
    (format defined during development).

**Exceptions:**

-   Step 4 --- Import file format invalid: System displays an error
    identifying the format issue and does not import the file.

**5. Business Rules**

  ---------------------------------------------------------------------------------
  **ID**   **Rule**                               **Applies    **Source**
                                                  To**         
  -------- -------------------------------------- ------------ --------------------
  BR-001   The system must support SMS delivery   FR-CD-001    SI-001 §4 ---
           coverage for recipients in the United               Technical
           States, Europe, and Latin America via               Constraints
           Twilio.                                             (Engagement
                                                               Orchestration and
                                                               Messaging)

  BR-002   The system must support dynamic        FR-AM-013,   SI-001 §4 --- Scope
           audience segmentation and              FR-AM-015    Boundaries (Audience
           communication delivery segmented by                 Management);
           country, filtering recipients by their              User-Provided Input
           country of record from JobDiva.                     BR-2

  BR-003   The system must schedule communication FR-JM-014,   SI-001 §2 --- Value
           delivery based on the recipient\'s     FR-CD-003    Comparison
           local time zone; communications must                (Time-Zone &
           not be delivered outside the                        Compliance);
           recipient\'s local business hours as                User-Provided Input
           defined by the journey scheduling                   BR-1
           configuration.                                      

  BR-004   The system must enforce                FR-CD-004,   SI-001 §5 --- Legal
           country-specific compliance rules for  FR-CD-009,   Constraints;
           communication delivery, including      FR-JM-015,   User-Provided Input
           permitted delivery windows, opt-out    FR-AM-016    BR-4
           handling, and applicable content                    
           restrictions (e.g., TCPA for US, GDPR               
           for Europe, CASL for Canada), applied               
           per recipient\'s country.                           

  BR-005   The system must support dynamic        FR-AM-013,   SI-001 §4 --- Scope
           inclusion and exclusion of audience    FR-AM-014,   Boundaries (Audience
           segments; a recipient matching an      FR-CD-009    Management);
           exclusion rule must be suppressed from              User-Provided Input
           communications for that audience                    BR-3
           regardless of inclusion rules.                      

  BR-006   The system must implement retry        FR-CD-006,   SI-001 §4 --- Scope
           mechanisms for failed communication    FR-JM-019,   Boundaries (Error
           deliveries; a failed delivery attempt  FR-EM-004    Management);
           must be retried according to the                    User-Provided Input
           per-step retry configuration before                 --- Error Management
           being marked as permanently failed.                 

  BR-007   The system must enforce role-based     FR-AA-005,   SI-001 §5 ---
           access control; users may only access  FR-AA-006    Technical
           platform features permitted by their                Constraints
           assigned role (Administrator or                     (Authentication and
           Business User).                                     Security)

  BR-008   The system must store all secrets ---  FR-CD-008,   SI-001 §5 ---
           JWT signing keys, Twilio and SendGrid  FR-JD-004,   Technical
           credentials, JobDiva credentials, and  FR-AA-007    Constraints
           Azure Key Vault access keys ---                     (Authentication and
           outside source code and outside the                 Security; Engagement
           frontend; Azure Key Vault is the                    Orchestration and
           required secrets store.                             Messaging)

  BR-009   The system must audit all key user and FR-EM-001,   SI-001 §5 ---
           system actions in a persistent audit   FR-EM-002    Technical
           log, compliant with ISO 27001                       Constraints
           requirements, recording user identity,              (Authentication and
           timestamp, action type, and target                  Security)
           entity for every auditable event.                   

  BR-010   Journey flow definitions --- nodes,    FR-JM-018    SI-001 §5 ---
           edges, positions, step properties,                  Technical
           name, and priority --- must be                      Constraints (Visual
           persisted in a versioned, auditable                 Flow / Journey
           form that is independent of the chosen              Editor)
           visual canvas library.                              

  BR-011   The JobDiva schema-to-internal-model   FR-JD-002    SI-001 §5 ---
           field mapping must be externalized as               Technical
           configuration and must not be                       Constraints (JobDiva
           hardcoded; the NEXA internal data                   Integration)
           model must not mirror the JobDiva                   
           schema directly.                                    

  BR-012   An active journey, audience, or survey FR-JM-003,   Derived from
           must be deactivated before it can be   FR-AM-003,   operational
           deleted.                               FR-SM-005    integrity
                                                               requirements

  BR-013   The system must support multi-language FR-AM-016,   User-Provided Input
           communications; audience segmentation  FR-TR-002    BR-4; SI-001 §4 ---
           and template assignment must allow                  Scope Boundaries
           language-specific targeting so that                 (Multi-Channel
           recipients receive communications in                Communication)
           their configured language preference.               

  BR-014   The MVP communication channels are     FR-CD-001,   SI-001 §4 --- Out of
           limited to SMS and Email; no other     FR-CD-002    Scope
           channel (WhatsApp, voice, chat) may be              
           activated or delivered in the MVP                   
           release.                                            
  ---------------------------------------------------------------------------------

**6. Out of Scope**

*Features explicitly excluded from this version.*

  ----------------------------------------------------------------------------
  **ID**   **Feature**          **Reason for Exclusion**
  -------- -------------------- ----------------------------------------------
  OS-001   Data Migration from  Historical SenseHQ data will not be migrated;
           SenseHQ              legacy system remains in parallel during
                                transition to protect continuity, as agreed at
                                kickoff and documented in SI-001 §4.

  OS-002   WhatsApp             Deferred to post-MVP; SMS and Email are the
           Communication        only delivery channels for MVP as agreed at
           Channel              kickoff and documented in SI-001 §4.

  OS-003   AI-Powered Voice     Deferred to post-MVP; voice calls are excluded
           Call Channel         from MVP scope per SI-001 §4.

  OS-004   Chat Communication   Deferred to post-MVP; chat is excluded from
           Channel              MVP scope per SI-001 §4.

  OS-005   Write-back /         NEXA is read-only against JobDiva in MVP; no
           Bidirectional ATS    candidate or employee profile updates are
           Sync with JobDiva    written back to JobDiva per SI-001 §4.

  OS-006   AI / MCP / LLM       Any AI-powered features, machine learning, or
           Capabilities         LLM integrations are explicitly excluded from
                                NEXA per SI-001 §4 and §5 technical
                                constraints.

  OS-007   Paid iPaaS or        No commercial integration middleware may be
           Packaged Integration used for JobDiva integration; custom .NET code
           Connectors           only, per SI-001 §5 technical constraints.

  OS-008   Calendar Integration Out of scope for MVP; pending future decision
           (OAuth2)             per SI-001 §4.

  OS-009   Export Functionality Export of workflows, user lists, surveys, and
                                reports is deferred to a future release as a
                                Won\'t v1 item per SI-001 §5 and v5.0 scope
                                revision.

  OS-010   Advanced Reporting / Complex analytics and custom report builders
           Custom Report        are deferred to v2 per SI-001 §4.
           Builder              

  OS-011   Multi-Tenant Support May be incorporated as the platform evolves;
           and Additional       not in scope for MVP per SI-001 §4.
           JobDiva Environments 

  OS-012   Real-Time and        May be added as required post-MVP; manual or
           Incremental JobDiva  adapter-triggered sync is sufficient for MVP
           Synchronization      per SI-001 §4.

  OS-013   Multi-Region High    Sizing to be determined during Architecture
           Availability         phase per corporate requirements; not
                                confirmed for MVP per SI-001 §4.

  OS-014   Azure Blob Storage   May be incorporated as the platform evolves;
           Integration          not in scope for MVP per SI-001 §4.
  ----------------------------------------------------------------------------

**7. External Integrations**

  --------------------------------------------------------------------------------------------
  **System**     **Purpose**           **Protocol**                       **Notes**
  -------------- --------------------- ---------------------------------- --------------------
  **JobDiva**    Read-only source of   Custom .NET adapter --- access     All access via
                 candidate and         model (API, direct DB, or read     dedicated JobDiva
                 employee data for     replica) to be confirmed by Colby  Adapter Service
                 audience              Sanders before Architecture phase  only; credentials in
                 segmentation,         begins                             Azure Key Vault;
                 recipient resolution,                                    field mapping
                 and dynamic template                                     externalized; no
                 content                                                  paid iPaaS
                                                                          connectors permitted

  **Twilio**     SMS communication     REST API                           Credentials stored
                 delivery for US,      via **ISmsSender** abstraction     in Azure Key Vault;
                 European, and Latin                                      never exposed to
                 American recipients                                      frontend; coverage
                                                                          and rate limits to
                                                                          be confirmed during
                                                                          Architecture phase

  **SendGrid**   Email communication   REST API                           Credentials stored
                 delivery              via **IEmailSender** abstraction   in Azure Key Vault;
                                                                          never exposed to
                                                                          frontend; vendor
                                                                          contract status to
                                                                          be confirmed by
                                                                          Technical Lead

  **Azure API    API gateway unifying  REST                               Frontend
  Management     all                                                      communicates only
  (APIM)**       frontend-to-backend                                      through APIM; no
                 communication                                            direct
                                                                          service-to-service
                                                                          calls from frontend

  **Azure Key    Centralized secrets   Azure SDK                          Required for all
  Vault**        management for all                                       secrets; no secrets
                 platform credentials,                                    in source code or
                 JWT signing keys, and                                    frontend
                 configuration secrets                                    

  **Azure DevOps CI/CD pipeline for    Azure DevOps native                Backend services
  Pipelines**    build and deployment                                     deployed to Azure
                 automation                                               App Service via APIM
  --------------------------------------------------------------------------------------------

**8. Traceability to SI**

  --------------------------------------------------------------------------------
  **FR ID**   **Requirement**       **SI Section**    **SI Requirement**
  ----------- --------------------- ----------------- ----------------------------
  FR-JM-001   The system shall      §4 Scope          Journey Management: Create,
              allow Business Users  Boundaries --- In edit, activate, deactivate,
              to create a new       Scope             and manage automated
              journey                                 journeys

  FR-JM-014   The system shall      §2 Value          Time-Zone & Compliance:
              allow scheduling per  Proposition ---   Communications scheduled per
              recipient local time  Value Comparison  recipient\'s local time zone
              zone                                    

  FR-JM-015   The system shall      §4 Scope          Multi-Channel Communication:
              support               Boundaries --- In country-specific compliance
              country-specific      Scope             rule enforcement
              compliance rules per                    
              journey                                 

  FR-JM-016   The system shall      §4 Scope          Journey Management: journey
              maintain journey      Boundaries --- In history and audit trail
              execution history     Scope             

  FR-JM-017   The system shall      §5 Constraints    OSS canvas library from
              provide a visual flow --- Visual Flow / approved pool: React Flow,
              editor using approved Journey Editor    Rete.js, or JointJS core
              OSS library                             

  FR-JM-018   Journey flow          §5 Constraints    The flow definition must be
              definitions must be   --- Visual Flow / persisted in a versioned,
              persisted in          Journey Editor    auditable form independent
              versioned, auditable                    of the chosen library
              form                                    

  FR-AM-013   The system shall      §4 Scope          Audience Management:
              support dynamic       Boundaries --- In real-time inclusion and
              inclusion of          Scope             exclusion of audience
              recipient segments                      segments

  FR-AM-014   The system shall      §4 Scope          Audience Management:
              support dynamic       Boundaries --- In real-time inclusion and
              exclusion of          Scope             exclusion of audience
              recipient segments                      segments

  FR-AM-015   The system shall      §2 Value          Audience Segmentation:
              support segmentation  Proposition ---   Dynamic segmentation by
              by country            Value Comparison  country, language, and
                                                      business rules

  FR-AM-017   The system shall      §4 Scope          User Lists: Creation,
              support user list     Boundaries --- In management, and maintenance
              creation and          Scope (v5.0)      of user lists for audience
              management                              targeting and journey
                                                      assignment

  FR-SM-001   The system shall      §4 Scope          Survey Creation and
              allow creation of     Boundaries --- In Personalization: Create,
              surveys               Scope (v5.0)      edit, and associate surveys
                                                      with journeys

  FR-SM-013   The system shall      §4 Scope          Survey Creation and
              allow surveys to be   Boundaries --- In Personalization: management
              associated with       Scope (v5.0)      of survey definitions and
              journey steps                           configurations

  FR-TR-001   The system shall      §4 Scope          Repository / Content
              provide a central     Boundaries --- In Repository: Centralized
              repository for        Scope (v5.0)      repository for reusable
              reusable templates                      assets, templates, and
                                                      configuration artifacts

  FR-TR-002   The system shall      §4 Scope          Template Management:
              allow creation of SMS Boundaries --- In Centralized creation and
              and Email             Scope             management of SMS and Email
              communication                           communication templates
              templates                               

  FR-TR-006   The system shall      §4 Scope          Template Management:
              support dynamic       Boundaries --- In Centralized creation and
              content placeholders  Scope             management of communication
              in templates                            templates

  FR-RP-001   The system shall      §4 Scope          Basic Reporting and
              provide a report      Boundaries --- In Analytics: report management
              management screen     Scope             interface included

  FR-RP-002   The system shall      §4 Scope          Basic Reporting and
              allow on-demand       Boundaries --- In Analytics: Operational
              report generation     Scope             reports and business
                                                      dashboards

  FR-RP-003   The system shall      §4 Scope          Basic Reporting and
              allow report          Boundaries --- In Analytics: report management
              scheduling            Scope             interface included

  FR-CD-001   The system shall      §5 Constraints    SMS delivery must use Twilio
              deliver SMS via       --- Engagement    with coverage for US,
              Twilio                Orchestration and Europe, and Latin America
                                    Messaging         

  FR-CD-002   The system shall      §5 Constraints    Email delivery must use
              deliver Email via     --- Engagement    SendGrid
              SendGrid              Orchestration and 
                                    Messaging         

  FR-CD-004   The system shall      §5 Constraints    The platform must support
              enforce               --- Legal         country-specific compliance
              country-specific      Constraints       rules for communication
              compliance rules at                     delivery
              delivery                                

  FR-CD-006   The system shall      §4 Scope          Error Management: Retry
              retry failed          Boundaries --- In mechanisms for failed
              deliveries            Scope             communication deliveries

  FR-CD-007   The system shall use  §5 Constraints    Each messaging channel must
              channel abstraction   --- Engagement    sit behind a custom
              interfaces            Orchestration and interface to avoid vendor
                                    Messaging         lock-in

  FR-JD-001   All JobDiva access    §5 Constraints    Integration with JobDiva
              via dedicated Adapter --- JobDiva       must be handled exclusively
              Service only          Integration       by a dedicated JobDiva
                                                      Adapter Service

  FR-JD-002   Field mapping must be §5 Constraints    The JobDiva
              externalized          --- JobDiva       schema-to-internal-model
                                    Integration       mapping must be externalized
                                                      as configuration

  FR-AA-001   Username and password §5 Constraints    Authentication must be based
              authentication        ---               on username and password
                                    Authentication    
                                    and Security      

  FR-AA-002   Secure password       §5 Constraints    Passwords must not be stored
              hashing               ---               in plain text; a secure
                                    Authentication    hashing mechanism is
                                    and Security      required

  FR-AA-003   JWT token issuance    §5 Constraints    The Auth Service must issue
                                    ---               JWT tokens for session and
                                    Authentication    service authentication
                                    and Security      

  FR-AA-005   Role-based access     §5 Constraints    Authorization must use
              control               ---               role-based access control
                                    Authentication    (RBAC) by business roles
                                    and Security      

  FR-EM-001   Audit log of all key  §5 Constraints    Key user and system actions
              user and system       ---               must be auditable in line
              actions               Authentication    with ISO 27001
                                    and Security      

  FR-AD-001   Administrative        §4 Scope          Administrative Dashboard:
              dashboard as landing  Boundaries --- In Operational and
              screen                Scope             administrative management
                                                      interface
  --------------------------------------------------------------------------------

**9. Document Control**

**Review & Approval**

  -------------------------------------------------------------------------------------
  **Role**           **Name**                    **Date**   **Status**   **Comments**
  ------------------ --------------------------- ---------- ------------ --------------
  BSA / PO           Andrea Bermudez Bazurto                Pending      

  Business Sponsor   InspyrSolutions Leadership             Pending      

  Tech Lead                                                 Pending      
  -------------------------------------------------------------------------------------

**Version History**

  ----------------------------------------------------------------------------------------
  **Version**   **Date**     **Author**        **Changes**
  ------------- ------------ ----------------- -------------------------------------------
  1.0           2026-06-19   Andrea Bermudez   Initial draft --- complete FRS generated
                             Bazurto (AI       from SI-001 and user-provided feature,
                             Assisted)         role, and business rule inputs

  ----------------------------------------------------------------------------------------

**10. Next Steps**

-    Review and sign this document --- Owner: Andrea Bermudez Bazurto
    (BSA/PO) --- Target: 2026-07-03

-    Confirm report content and layouts with Milgrim Bello and Amanda
    Hilsenbeck --- Owner: Andrea Bermudez Bazurto --- Target: Before
    Requirements phase closes

-    Confirm applicable compliance regulations per country (TCPA, GDPR,
    CASL) with Jim Barrett and Legal/Compliance team --- Owner: Jim
    Barrett --- Target: Before Requirements phase closes

-    Confirm JobDiva data access model (API, direct DB, or read replica)
    with Colby Sanders --- Owner: Colby Sanders --- Target: Before
    Architecture phase begins

-    Finalize Administrative Dashboard metric definitions with Milgrim
    Bello and Amanda Hilsenbeck --- Owner: Andrea Bermudez Bazurto ---
    Target: Requirements phase closure

-    Validate final MVP journey list with Jim Barrett and Paula Sanders
    --- Owner: Andrea Bermudez Bazurto --- Target: Before backlog
    finalization

**If Approved → Proceed to Phase 3:** Requirements --- Non-Functional
Requirements Specification (Target: 2026-07-10)

**Document Control**

  -----------------------------------------------------------------------
  **Field**              **Value**
  ---------------------- ------------------------------------------------
  Author                 Andrea Bermudez Bazurto (AI Assisted)

  Approval Authority     BSA

  Status                 Draft

  Signature              ⏳ Pending --- awaiting approval
  -----------------------------------------------------------------------

*--- End of document ---*
