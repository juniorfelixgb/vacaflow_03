**Backlog**

**Prioritized Backlog: NEXA**

**Project:** NEXA --- InspyrSolutions **Document
ID:** BLG-001 **Stage:** 05 --- Planning **Author:** Andrea Bermudez (AI
Assisted) **Product Owner / BSA:** Andrea Bermudez Bazurto **Related
Documents:** FRS-001, SI-001, SAD-001 **Sprint Velocity:** 4-person team
(1 Developer, 1 QA, 1 Tech Lead, 1 PO) --- estimated 6--8 stories per
sprint **Date:** 2026-06-30 **Version:** 1.0

**MoSCoW Summary**

  ------------------------------------------------------------------------
  **Priority**        **Stories**    **Sprint**      **Estimated
                                                     Velocity**
  ------------------- -------------- --------------- ---------------------
  Must Have           28 stories     Sprint 1--3     8 stories/sprint

  Should Have         11 stories     Sprint 3--4     6 stories/sprint

  Won\'t v1           14 items       Deferred        ---

  **Total**           **53**                         
  ------------------------------------------------------------------------

**User Story Summary**

  -----------------------------------------------------------------------------------------------------
  **ID**   **Title**                   **Priority**   **Sprint**   **Source FR(s)**  **Dependencies**
  -------- --------------------------- -------------- ------------ ----------------- ------------------
  US-001   Authenticate with Username  Must Have      Sprint 1     FR-AA-001,        None
           and Password                                            FR-AA-002,        
                                                                   FR-AA-004         

  US-002   Session Expiration and      Must Have      Sprint 1     FR-AA-003         US-001
           Secure Logout                                                             

  US-003   Create and Manage User      Must Have      Sprint 1     FR-AA-006,        US-001
           Accounts (Admin)                                        FR-AA-007         

  US-004   Enforce Role-Based Access   Must Have      Sprint 1     FR-AA-005         US-003
           Control (RBAC)                                                            

  US-005   Audit Log for Key Actions   Must Have      Sprint 1     FR-AA-008         US-001

  US-006   Encrypt Data in Transit and Must Have      Sprint 1     FR-AA-009         None
           at Rest                                                                   

  US-007   Retrieve Secrets from Azure Must Have      Sprint 1     FR-AA-010         None
           Key Vault                                                                 

  US-008   Create and Configure a      Must Have      Sprint 2     FR-JM-001,        US-001
           Journey                                                 FR-JM-012,        
                                                                   FR-JM-018         

  US-009   Edit and Delete a Journey   Must Have      Sprint 2     FR-JM-002,        US-008
                                                                   FR-JM-003         

  US-010   Activate and Deactivate a   Must Have      Sprint 2     FR-JM-004,        US-008
           Journey                                                 FR-JM-005         

  US-011   View Journeys in Grid with  Must Have      Sprint 2     FR-JM-006,        US-008
           Search, Sort, and Filter                                FR-JM-007,        
                                                                   FR-JM-008,        
                                                                   FR-JM-009         

  US-012   Configure Time Zone--Aware  Must Have      Sprint 2     FR-JM-013         US-008
           Communication Delivery                                                    

  US-013   Configure Country-Specific  Must Have      Sprint 2     FR-JM-014,        US-008
           and Language-Specific                                   FR-JM-015         
           Journey Rules                                                             

  US-014   Persist Journey Flow        Must Have      Sprint 2     FR-JM-019         US-008
           Definition in Versioned                                                   
           Form                                                                      

  US-015   View Journey Execution      Must Have      Sprint 2     FR-JM-016,        US-010
           History                                                 FR-JM-017         

  US-016   Configure Journey           Must Have      Sprint 2     FR-JM-020         US-008
           Recurrence Rules                                                          

  US-017   Support Eight Priority      Must Have      Sprint 3     FR-JM-021         US-008, US-010,
           Journeys at Go-Live                                                       US-013

  US-018   Create and Manage Audiences Must Have      Sprint 2     FR-AM-001,        US-001
           with Segmentation Rules                                 FR-AM-002,        
                                                                   FR-AM-003,        
                                                                   FR-AM-004         

  US-019   View Audiences in Grid with Must Have      Sprint 2     FR-AM-005,        US-018
           Search, Sort, and Filter                                FR-AM-006,        
                                                                   FR-AM-007,        
                                                                   FR-AM-008         

  US-020   Dynamic Audience Inclusion  Must Have      Sprint 2     FR-AM-011,        US-018
           and Exclusion at Execution                              FR-AM-012,        
           Time                                                    FR-AM-013,        
                                                                   FR-AM-014         

  US-021   Create and Manage User      Must Have      Sprint 2     FR-AM-015,        US-018
           Lists for Fixed Audience                                FR-AM-016         
           Components                                                                

  US-022   Enforce Country-Specific    Must Have      Sprint 3     FR-AM-018         US-020
           Compliance Rules on                                                       
           Audience and Delivery                                                     

  US-023   Create and Manage           Must Have      Sprint 2     FR-TM-001,        US-001
           Communication Templates                                 FR-TM-002,        
                                                                   FR-TM-003,        
                                                                   FR-TM-004         

  US-024   Resolve Templates with      Must Have      Sprint 2     FR-TM-005,        US-023
           Personalization Tokens at                               FR-TM-006,        
           Delivery                                                FR-TM-007         

  US-025   Create and Manage Surveys   Must Have      Sprint 3     FR-SV-001,        US-001
                                                                   FR-SV-002,        
                                                                   FR-SV-003,        
                                                                   FR-SV-004         

  US-026   Associate Surveys with      Must Have      Sprint 3     FR-SV-011,        US-025, US-008
           Journey Steps and Deliver                               FR-SV-012,        
           Personalized Surveys                                    FR-SV-013         

  US-027   Automatically Retry Failed  Must Have      Sprint 3     FR-EM-001,        US-010
           Deliveries                                              FR-EM-002         

  US-028   View and Filter Error Log   Must Have      Sprint 3     FR-EM-003         US-027

  US-029   Bulk Edit Journeys (Status  Should Have    Sprint 3     FR-JM-010,        US-011
           Change and Bulk Delete)                                 FR-JM-011         

  US-030   Bulk Edit and Bulk Delete   Should Have    Sprint 3     FR-AM-009,        US-019
           Audiences                                               FR-AM-010         

  US-031   Preview Estimated Audience  Should Have    Sprint 3     FR-AM-017         US-020
           Member Count Before                                                       
           Assignment                                                                

  US-032   Bulk Edit and Bulk Delete   Should Have    Sprint 4     FR-SV-009,        US-026
           Surveys                                                 FR-SV-010         

  US-033   Configure Country-Specific  Should Have    Sprint 4     FR-SV-014         US-026
           Survey Delivery Rules                                                     

  US-034   Generate Reports On Demand  Should Have    Sprint 3     FR-RP-001,        US-001
           and Schedule Recurring                                  FR-RP-002,        
           Reports                                                 FR-RP-003,        
                                                                   FR-RP-004         

  US-035   Search, Sort, and Filter    Should Have    Sprint 3     FR-RP-005,        US-034
           Reports Grid                                            FR-RP-006,        
                                                                   FR-RP-007         

  US-036   Journey Execution Report    Should Have    Sprint 3     FR-RP-008         US-034, US-015

  US-037   Communication Delivery      Should Have    Sprint 4     FR-RP-009         US-034
           Report                                                                    

  US-038   Notify Users on Exhausted   Should Have    Sprint 4     FR-EM-004         US-027
           Delivery Retries                                                          

  US-039   Manual Retry of Exhausted   Should Have    Sprint 4     FR-EM-005         US-027
           Failed Deliveries                                                         
  -----------------------------------------------------------------------------------------------------

**1. Must Have --- Sprint 1--3**

*These stories implement the core functional requirements. The platform
cannot launch without them.*

**US-001: Authenticate with Username and Password**

**As a** User, **I want to** log in to NEXA using my username and
password, **So that** I can securely access the platform and all
features assigned to my role.

**Source Requirements:** FR-AA-001, FR-AA-002, FR-AA-004

**Acceptance Criteria:**

  -----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**          **When**    **Then**
  -------- -------------- ------------------ ----------- ----------------------------
  AC-001   Successful     A registered and   They submit The system validates
           login          active user        the login   credentials against the
                          provides a valid   form        stored hash, issues a JWT
                          username and                   token with role claims, and
                          correct password               redirects the user to the
                                                         main dashboard

  AC-002   Invalid        A user provides a  They submit The system rejects the
           credentials    valid username but the login   attempt and displays a
           --- incorrect  an incorrect       form        generic authentication error
           password       password                       without indicating which
                                                         field is incorrect; no token
                                                         is issued

  AC-003   Invalid        A user provides a  They submit The system rejects the
           credentials    username that does the login   attempt with the same
           --- unknown    not exist in the   form        generic error message as
           username       system                         AC-002 (no username
                                                         enumeration)

  AC-004   Password       An administrator   The         The stored value is a secure
           storage        creates or updates password is hash (bcrypt or equivalent);
           security       a user account     persisted   the plain-text password is
                          with a password                never present in the
                                                         database or any log
  -----------------------------------------------------------------------------------

**Business Rules:** BR-018 (Passwords must not be stored in plain text),
BR-007 (RBAC enforced on all features) **Dependencies:** None **Sprint
Assignment:** Sprint 1

**US-002: Session Expiration and Secure Logout**

**As a** User, **I want to** have my session automatically expire after
a period of inactivity and be able to log out manually, **So
that** unauthorized access to my account is prevented if I leave my
workstation unattended.

**Source Requirements:** FR-AA-003

**Acceptance Criteria:**

  -----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**            **When**     **Then**
  -------- -------------- -------------------- ------------ -------------------------
  AC-001   Session        An authenticated     They attempt The system rejects the
           expiration on  user\'s session has  to access    request, invalidates the
           inactivity     been idle for longer any          JWT, and redirects the
                          than the configured  protected    user to the login screen
                          expiration period    resource     with an informational
                                                            message

  AC-002   Manual logout  An authenticated     The logout   The system invalidates
                          user clicks the      action is    the user\'s JWT, clears
                          logout control       confirmed    the session, and
                                                            redirects the user to the
                                                            login screen

  AC-003   Expired token  A user holds an      They send an The system returns HTTP
           rejected       expired JWT          API request  401 Unauthorized; no data
                                               with the     is returned
                                               expired      
                                               token        
  -----------------------------------------------------------------------------------

**Business Rules:** BR-007 **Dependencies:** US-001 **Sprint
Assignment:** Sprint 1

**US-003: Create and Manage User Accounts (Admin)**

**As a** User with administrative privileges, **I want to** create,
edit, deactivate, and delete other user accounts, **So that** the
organization can onboard and offboard NEXA users without IT involvement.

**Source Requirements:** FR-AA-006, FR-AA-007

**Acceptance Criteria:**

  --------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**              **When**       **Then**
  -------- -------------- ---------------------- -------------- ------------------------
  AC-001   Create a new   An administrative User They submit    The system creates the
           user           is on the user         the create     user account, applies
                          administration screen  user form      the role assignment, and
                          and provides a valid                  the new user appears in
                          name, email, and role                 the user list
                          assignment                            

  AC-002   Duplicate      An administrative User They attempt   The system displays a
           username       provides a username    to create the  validation error
           blocked        already registered in  account        indicating the username
                          the system                            is already in use and
                                                                does not create the
                                                                account

  AC-003   Deactivate a   An administrative User Deactivation   The system deactivates
           user           selects an active user is confirmed   the account; any active
                          and initiates                         sessions for that user
                          deactivation                          are invalidated
                                                                immediately; the user
                                                                can no longer log in

  AC-004   Edit role      An administrative User The change is  The system applies the
           assignment     selects an existing    saved          updated role; the
                          user and modifies                     affected user\'s next
                          their role                            authenticated request
                                                                reflects the new role
                                                                claims
  --------------------------------------------------------------------------------------

**Business Rules:** BR-007, BR-008 **Dependencies:** US-001 **Sprint
Assignment:** Sprint 1

**US-004: Enforce Role-Based Access Control (RBAC)**

**As a** User, **I want to** access only the features and data my role
permits, **So that** sensitive administrative functions are protected
from unauthorized access.

**Source Requirements:** FR-AA-005

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**     **Given**            **When**     **Then**
  -------- ---------------- -------------------- ------------ ----------------------
  AC-001   Standard user    A User without       The request  The system denies the
           blocked from     administrative       is received  request, returns an
           admin function   privileges attempts  by the       authorization error,
                            to access the user   system       and the admin section
                            administration                    is not rendered
                            section                           

  AC-002   Administrative   A User with          The page     The system displays
           user accesses    administrative       loads        the user management
           admin function   privileges navigates              interface with full
                            to the user                       create, edit,
                            administration                    deactivate, and delete
                            section                           capabilities

  AC-003   RBAC enforced on A standard user      The request  The system returns
           API level        calls an API         carries a    HTTP 403 Forbidden
                            endpoint designated  valid JWT    regardless of whether
                            for administrators   without      the call originates
                                                 admin role   from the UI or
                                                 claim        directly
  ----------------------------------------------------------------------------------

**Business Rules:** BR-007 **Dependencies:** US-003 **Sprint
Assignment:** Sprint 1

**US-005: Audit Log for Key Actions**

**As a** User with administrative privileges, **I want to** have all key
user and system actions automatically recorded in an audit log, **So
that** the organization can meet ISO 27001 compliance requirements and
investigate incidents.

**Source Requirements:** FR-AA-008

**Acceptance Criteria:**

  -------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**       **When**    **Then**
  -------- -------------- --------------- ----------- ---------------------------------
  AC-001   Login action   A user          The JWT is  The system writes an audit record
           logged         successfully    issued      containing the user identity,
                          authenticates               action type (LOGIN), affected
                                                      entity (user account), and UTC
                                                      timestamp

  AC-002   Journey        A user          The status  The system writes an audit record
           activation     activates a     changes to  with user identity, action
           logged         journey         Active      (JOURNEY_ACTIVATED), journey ID,
                                                      and UTC timestamp

  AC-003   Template       A user deletes  The         The system writes an audit record
           deletion       a template      deletion is with user identity, action
           logged                         confirmed   (TEMPLATE_DELETED), template ID,
                                                      and UTC timestamp

  AC-004   Audience       A user modifies The change  The system writes an audit record
           modification   an audience     is saved    with user identity, action
           logged         segmentation                (AUDIENCE_MODIFIED), audience ID,
                          rule                        changed fields, and UTC timestamp
  -------------------------------------------------------------------------------------

**Business Rules:** BR-008 **Dependencies:** US-001 **Sprint
Assignment:** Sprint 1

**US-006: Encrypt Data in Transit and at Rest**

**As a** Platform Administrator, **I want to** all data transmitted to
and from NEXA to be encrypted via TLS and all sensitive stored data to
be encrypted at rest, **So that** the platform meets its security and
compliance obligations under ISO 27001 and applicable data protection
regulations.

**Source Requirements:** FR-AA-009

**Acceptance Criteria:**

  ---------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**            **When**     **Then**
  -------- -------------- -------------------- ------------ -----------------------------
  AC-001   TLS enforced   A client attempts to The request  The system redirects to HTTPS
           on all         connect to any NEXA  is received  or rejects the connection; no
           endpoints      endpoint using plain              data is transmitted over
                          HTTP                              unencrypted HTTP

  AC-002   Sensitive data Sensitive data       The write    Azure SQL Transparent Data
           encrypted at   (candidate PII,      operation    Encryption (TDE) ensures the
           rest           credentials) is      completes    data is encrypted on disk; no
                          written to Azure SQL              unencrypted sensitive data
                                                            exists in persistent storage

  AC-003   Rejection of   A service-to-service The          The receiving service rejects
           insecure       call is attempted    connection   the connection and logs a
           connection     with TLS disabled    is initiated security event
           attempt                                          
  ---------------------------------------------------------------------------------------

**Business Rules:** BR-019 **Dependencies:** None **Sprint
Assignment:** Sprint 1

**US-007: Retrieve Secrets from Azure Key Vault**

**As a** Platform Administrator, **I want to** all NEXA services to
retrieve API keys and credentials from Azure Key Vault at runtime using
Managed Identity, **So that** no secret ever appears in source code,
configuration files, or environment variables.

**Source Requirements:** FR-AA-010

**Acceptance Criteria:**

  ---------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**         **When**        **Then**
  -------- -------------- ----------------- --------------- -----------------------------
  AC-001   Service        An ACA service    The service     The service retrieves all
           retrieves      starts in the     initializes its required secrets (Twilio Auth
           secret at      production        configuration   Token, SendGrid API Key,
           startup        environment                       connection strings) from
                                                            Azure Key Vault via Managed
                                                            Identity; no secret is read
                                                            from environment variables or
                                                            config files

  AC-002   No secrets in  The codebase is   The scan runs   Zero secrets, API keys, or
           source code    scanned by a      in CI           credential strings are
                          static analysis                   detected in the source code
                          tool (gitleaks or                 or any committed
                          truffleHog)                       configuration file

  AC-003   Access denied  A service         The request is  Azure Key Vault denies the
           on identity    instance without  made            request with a 403 response;
           mismatch       a correctly                       the service logs the failure
                          configured                        and does not start
                          Managed Identity                  
                          attempts to                       
                          access Key Vault                  
  ---------------------------------------------------------------------------------------

**Business Rules:** BR-006 **Dependencies:** None **Sprint
Assignment:** Sprint 1

**US-008: Create and Configure a Journey**

**As a** User, **I want to** create a new journey by providing a name,
description, target audience, trigger condition, and at least one step
using a visual flow editor, **So that** I can set up automated
multi-channel communications for a defined audience without technical
team involvement.

**Source Requirements:** FR-JM-001, FR-JM-012, FR-JM-018

**Acceptance Criteria:**

  -------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**                 **When**     **Then**
  -------- -------------- ------------------------- ------------ ----------------------
  AC-001   Successful     A User is on the Journey  They select  The system creates the
           journey        Management screen and     \"Save\"     journey in Draft
           creation       provides a name,                       status and it appears
                          description, target                    in the journey grid
                          audience, a valid trigger              
                          condition, and at least                
                          one step using the visual              
                          flow editor                            

  AC-002   Required field A User submits the create Submission   The system displays a
           validation --- journey form without      is attempted validation error
           missing        selecting a target                     identifying the
           audience       audience                               missing field; the
                                                                 journey is not created

  AC-003   Required field A User submits the create Submission   The system displays a
           validation --- journey form with zero    is attempted validation error
           no steps       steps configured in the                requiring at least one
                          flow                                   step; the journey is
                                                                 not created

  AC-004   Visual flow    A User navigates to the   The page     The OSS canvas
           editor renders journey creation screen   loads        component (React Flow,
           on supported                                          Rete.js, or JointJS
           browser                                               core) renders a
                                                                 drag-and-drop flow
                                                                 editor without
                                                                 requiring any paid
                                                                 license activation
  -------------------------------------------------------------------------------------

**Business Rules:** BR-009, BR-017,
BR-016 **Dependencies:** US-001 **Sprint Assignment:** Sprint 2

**US-009: Edit and Delete a Journey**

**As a** User, **I want to** edit an existing journey\'s configuration
and delete journeys that are no longer needed, **So that** I can keep
the journey catalog accurate and free of obsolete workflows.

**Source Requirements:** FR-JM-002, FR-JM-003

**Acceptance Criteria:**

  -----------------------------------------------------------------------------------
  **\#**   **Scenario**    **Given**         **When**    **Then**
  -------- --------------- ----------------- ----------- ----------------------------
  AC-001   Edit journey    A User opens an   They modify The system persists the
           configuration   existing journey  a step and  updated configuration and
                           in Draft or       save        the modified date is updated
                           Inactive status               in the grid

  AC-002   Delete inactive A User selects an Deletion is The system permanently
           journey         Inactive journey  confirmed   removes the journey; it no
                           and confirms                  longer appears in the grid
                           deletion                      

  AC-003   Delete active   A User selects a  Deletion is The system displays a
           journey blocked journey in Active attempted   message instructing the user
                           status and                    to deactivate the journey
                           attempts to                   before deleting; no deletion
                           delete it                     occurs
  -----------------------------------------------------------------------------------

**Business Rules:** BR-009 **Dependencies:** US-008 **Sprint
Assignment:** Sprint 2

**US-010: Activate and Deactivate a Journey**

**As a** User, **I want to** activate a journey to begin executing it
for matching audience members and deactivate it to halt new
executions, **So that** I control exactly when automated communications
are sent.

**Source Requirements:** FR-JM-004, FR-JM-005

**Acceptance Criteria:**

  -------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**          **When**       **Then**
  -------- -------------- ------------------ -------------- ---------------------------
  AC-001   Activate a     A User selects a   They activate  The system validates the
           valid journey  journey in Draft   the journey    configuration, sets status
                          or Inactive status                to Active, and the journey
                          that has a valid                  begins executing for
                          audience and at                   matching audience members
                          least one                         upon trigger conditions
                          configured step                   being met

  AC-002   Activate       A User activates a Activation is  The system displays a
           journey with   journey whose      attempted      warning informing the user
           zero-member    audience currently                the audience has no current
           audience ---   resolves to zero                  members; the user may
           warning        members                           proceed or reconfigure

  AC-003   Deactivate an  A User deactivates Deactivation   The system halts new
           active journey an Active journey  is confirmed   executions; the status
                                                            changes to Inactive in the
                                                            grid; in-progress
                                                            executions complete or are
                                                            cancelled per the
                                                            journey\'s deactivation
                                                            configuration
  -------------------------------------------------------------------------------------

**Business Rules:** BR-009, BR-015 **Dependencies:** US-008 **Sprint
Assignment:** Sprint 2

**US-011: View Journeys in Grid with Search, Sort, and Filter**

**As a** User, **I want to** view all journeys in a structured grid with
the ability to search, sort, and filter, **So that** I can quickly
locate and assess specific journeys without scrolling through an
unorganized list.

**Source Requirements:** FR-JM-006, FR-JM-007, FR-JM-008, FR-JM-009

**Acceptance Criteria:**

  ------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**       **When**   **Then**
  -------- -------------- --------------- ---------- ---------------------------------
  AC-001   Grid displays  A User          The screen The system displays a grid with
           required       navigates to    loads      columns: name, status, audience,
           columns        Journey                    created date, last modified date,
                          Management                 and last execution date

  AC-002   Search by name A User enters a Results    The system displays only journeys
                          search term in  refresh    whose name or description
                          the search                 contains the search term
                          field                      (case-insensitive)

  AC-003   Sort by column A User clicks a The sort   The system re-orders the grid by
                          column header   is applied the selected column in ascending
                                                     order; a second click reverses to
                                                     descending

  AC-004   Filter by      A User applies  The filter The system displays only journeys
           status         a status filter is applied in Active status; all other
                          (Active)                   journeys are hidden from the view
  ------------------------------------------------------------------------------------

**Business Rules:** BR-007 **Dependencies:** US-008 **Sprint
Assignment:** Sprint 2

**US-012: Configure Time Zone--Aware Communication Delivery**

**As a** User, **I want to** schedule journey communications to be
delivered at a specific local time for each recipient, **So
that** candidates and employees receive messages during appropriate
hours in their own time zone.

**Source Requirements:** FR-JM-013

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**         **When**    **Then**
  -------- -------------- ----------------- ----------- ----------------------------
  AC-001   Delivery at    A journey step is The system  The communication is sent at
           correct local  configured for    processes   14:00 UTC so that it arrives
           time           delivery at 9:00  the         at 9:00 AM in the
                          AM and a          delivery    recipient\'s local time zone
                          recipient is in               
                          time zone UTC-5               

  AC-002   Delivery at    The same journey  The system  The communication is sent at
           correct local  step targets a    processes   08:00 UTC so that it arrives
           time ---       recipient in time the         at 9:00 AM in that
           different zone zone UTC+1        delivery    recipient\'s local time zone

  AC-003   Missing time   A recipient has   The system  The system applies the
           zone on        no time zone      attempts to configured fallback time
           recipient      recorded in       schedule    zone (defined per journey or
                          JobDiva data      delivery    system default) and logs a
                                                        warning; the message is not
                                                        suppressed silently
  ----------------------------------------------------------------------------------

**Business Rules:** BR-001 **Dependencies:** US-008 **Sprint
Assignment:** Sprint 2

**US-013: Configure Country-Specific and Language-Specific Journey
Rules**

**As a** User, **I want to** configure country-specific compliance rules
and language preferences within a journey, **So that** communications
respect regional regulations and are delivered in the recipient\'s
preferred language.

**Source Requirements:** FR-JM-014, FR-JM-015

**Acceptance Criteria:**

  ---------------------------------------------------------------------------------------
  **\#**   **Scenario**        **Given**           **When**    **Then**
  -------- ------------------- ------------------- ----------- --------------------------
  AC-001   Country-specific    A journey is        The journey The system applies the
           rule applied        configured with a   executes    US-specific compliance
                               country rule for    for a       constraints (delivery
                               the United States   US-based    window, opt-out handling)
                                                   recipient   to that recipient\'s
                                                               communication steps

  AC-002   Language-specific   A journey step is   The step is The system selects the
           content delivered   configured for      executed    Spanish-language template
                               Spanish content and             variant and delivers the
                               the recipient\'s                Spanish content to that
                               language preference             recipient
                               is Spanish                      

  AC-003   Language fallback   A journey step does The step is The system applies the
                               not have a template processed   journey\'s configured
                               variant for the                 default language template
                               recipient\'s                    and logs the fallback
                               language                        event; the message is not
                                                               suppressed
  ---------------------------------------------------------------------------------------

**Business Rules:** BR-002, BR-011,
BR-012 **Dependencies:** US-008 **Sprint Assignment:** Sprint 2

**US-014: Persist Journey Flow Definition in Versioned Form**

**As a** User, **I want to** the system to save the full journey flow
definition --- nodes, edges, positions, and properties --- in a
versioned and auditable form independent of the visual editor
library, **So that** journey configurations can be audited, restored,
and are not at risk of loss if the canvas library changes.

**Source Requirements:** FR-JM-019

**Acceptance Criteria:**

  -------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**      **When**        **Then**
  -------- -------------- -------------- --------------- ------------------------------
  AC-001   Flow persisted A User saves a The save        The system stores a versioned
           on save        journey flow   operation       record containing all node
                          with three     completes       types, edge connections,
                          nodes and two                  canvas positions, and step
                          edges in the                   properties in Azure SQL,
                          visual editor                  independent of the canvas
                                                         library\'s internal state

  AC-002   Previous       A User saves a The new version The previous version record is
           version        modified       is created      retained in the audit trail
           retrievable    version of an                  and can be retrieved by an
                          existing                       administrator
                          journey flow                   

  AC-003   Flow           The canvas     The journey     The system reconstructs the
           restoration    library is     configuration   flow from the persisted
           independence   upgraded to a  screen is       database record without data
                          new version    loaded          loss; no flow definition is
                                                         stored only in the canvas
                                                         library\'s local format
  -------------------------------------------------------------------------------------

**Business Rules:** BR-016, BR-017 **Dependencies:** US-008 **Sprint
Assignment:** Sprint 2

**US-015: View Journey Execution History**

**As a** User, **I want to** view the full execution history of a
specific journey, **So that** I can monitor communication delivery
outcomes and diagnose issues.

**Source Requirements:** FR-JM-016, FR-JM-017

**Acceptance Criteria:**

  -----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**           **When**    **Then**
  -------- -------------- ------------------- ----------- ---------------------------
  AC-001   Execution      A User navigates to The         The system displays a log
           history        the detail view of  execution   of all trigger events,
           displayed      a journey that has  history tab audience members processed,
                          completed at least  is selected step outcomes, and delivery
                          one execution                   statuses with UTC
                                                          timestamps

  AC-002   History for    A User views the    The history The system displays an
           journey with   execution history   tab is      empty state message
           no executions  of a journey that   selected    indicating no executions
                          has never been                  have occurred
                          executed                        

  AC-003   Individual     A User selects a    The record  The system displays
           execution      specific execution  is opened   recipient-level step
           record detail  record in the                   outcomes, error codes (if
                          history list                    any), and retry counts for
                                                          that execution
  -----------------------------------------------------------------------------------

**Business Rules:** BR-008 **Dependencies:** US-010 **Sprint
Assignment:** Sprint 2

**US-016: Configure Journey Recurrence Rules**

**As a** User, **I want to** configure recurrence rules for a journey,
including frequency, start date, end date, and maximum execution
count, **So that** automated campaigns repeat on a defined schedule
without manual re-triggering.

**Source Requirements:** FR-JM-020

**Acceptance Criteria:**

  ------------------------------------------------------------------------------------
  **\#**   **Scenario**    **Given**            **When**        **Then**
  -------- --------------- -------------------- --------------- ----------------------
  AC-001   Recurring       A journey is         The scheduled   The system executes
           journey         configured with a    trigger fires   the journey for the
           executes on     weekly recurrence                    current matching
           schedule        starting on a                        audience on each
                           specific date with                   weekly occurrence
                           no end date                          

  AC-002   Journey stops   A journey is         The third       The system marks the
           after max       configured with a    execution       journey as completed
           execution count maximum execution    completes       and does not trigger
                           count of 3                           further executions

  AC-003   Journey stops   A journey is         The end date    The system does not
           at end date     configured with an   passes          trigger any further
                           end date                             executions even if the
                                                                schedule would
                                                                otherwise fire

  AC-004   Invalid         A User configures an The             The system displays a
           recurrence      end date before the  configuration   validation error and
           configuration   start date           is saved        does not save the
           blocked                                              invalid recurrence
                                                                configuration
  ------------------------------------------------------------------------------------

**Business Rules:** BR-001 **Dependencies:** US-008 **Sprint
Assignment:** Sprint 2

**US-017: Support Eight Priority Journeys at Go-Live**

**As a** User from Marketing, HR, or HR Operations, **I want to** the
eight priority journeys defined at kickoff to be fully configured and
operational at MVP go-live, **So that** NEXA immediately replaces the
SenseHQ communication engine for InspyrSolutions\' highest-volume
workflows.

**Source Requirements:** FR-JM-021

**Acceptance Criteria:**

  --------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**                     **When**    **Then**
  -------- -------------- ----------------------------- ----------- --------------------
  AC-001   All eight      All eight journeys            MVP go-live All eight journeys
           priority       (Candidates Placed INFRA,     date is     are in Active
           journeys in    Candidates Placed IT,         reached     status, have valid
           Active status  Terminations/Offboarding                  audience
           at go-live     Amazon AWS, Cisco, General,               assignments, and
                          Meta, Payroll W2, Payroll                 have completed at
                          C2C) have been configured and             least one successful
                          activated                                 test execution in
                                                                    the staging
                                                                    environment

  AC-002   Journey        Each priority journey is      The journey Each step completes
           execution      triggered in the staging      executes    without error;
           verified in    environment with a test                   delivery outcomes
           staging        audience                                  are recorded in the
                                                                    execution history

  AC-003   Missing        Fewer than eight priority     Go-live     The go-live
           priority       journeys are in Active status readiness   checklist item for
           journey blocks                               review is   FR-JM-021 is marked
           go-live                                      conducted   as blocked;
                                                                    deployment to
                                                                    production is not
                                                                    approved until all
                                                                    eight are active
  --------------------------------------------------------------------------------------

**Business Rules:** BR-015 **Dependencies:** US-008, US-010,
US-013 **Sprint Assignment:** Sprint 3

**US-018: Create and Manage Audiences with Segmentation Rules**

**As a** User, **I want to** create, edit, activate/deactivate, and
delete audience definitions using configurable segmentation rules, **So
that** I can define precise target groups for journeys without manual
list curation.

**Source Requirements:** FR-AM-001, FR-AM-002, FR-AM-003, FR-AM-004

**Acceptance Criteria:**

  ---------------------------------------------------------------------------------
  **\#**   **Scenario**    **Given**             **When**     **Then**
  -------- --------------- --------------------- ------------ ---------------------
  AC-001   Create audience A User provides an    They save    The system creates
           with            audience name,        the audience the audience in
           segmentation    description, and at                Active status and it
           rules           least one                          appears in the
                           segmentation rule                  audience grid

  AC-002   Save without    A User submits the    Submission   The system displays a
           name blocked    audience form without is attempted validation error; the
                           providing a name                   audience is not
                                                              created

  AC-003   Delete audience A User selects an     Deletion is  The system
           not assigned to audience not assigned confirmed    permanently removes
           active journey  to any active journey              the audience

  AC-004   Delete audience A User selects an     Deletion is  The system displays a
           assigned to     audience currently    attempted    message indicating
           active journey  assigned to an active              the audience is in
           blocked         journey                            use and blocks the
                                                              deletion
  ---------------------------------------------------------------------------------

**Business Rules:** BR-002, BR-003 **Dependencies:** US-001 **Sprint
Assignment:** Sprint 2

**US-019: View Audiences in Grid with Search, Sort, and Filter**

**As a** User, **I want to** view all audiences in a grid with search,
sort, and filter capabilities, **So that** I can efficiently locate and
assess specific audience definitions.

**Source Requirements:** FR-AM-005, FR-AM-006, FR-AM-007, FR-AM-008

**Acceptance Criteria:**

  -----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**       **When**   **Then**
  -------- -------------- --------------- ---------- --------------------------------
  AC-001   Grid displays  A User          The screen The system displays a grid with
           required       navigates to    loads      columns: name, status, member
           columns        Audience                   count, country, language, and
                          Management                 last modified date

  AC-002   Search by name A User enters a Results    The system displays only
                          search term     refresh    audiences whose name or
                                                     description contains the search
                                                     term

  AC-003   Filter by      A User applies  The filter The system displays only
           country        a country       is applied audiences configured for the
                          filter                     selected country
  -----------------------------------------------------------------------------------

**Business Rules:** BR-002 **Dependencies:** US-018 **Sprint
Assignment:** Sprint 2

**US-020: Dynamic Audience Inclusion and Exclusion at Execution Time**

**As a** User, **I want to** configure audience segmentation rules based
on country and language that are evaluated dynamically at journey
execution time using current JobDiva data, **So that** the audience
always reflects current candidate and employee records, not a snapshot
from when the audience was defined.

**Source Requirements:** FR-AM-011, FR-AM-012, FR-AM-013, FR-AM-014

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**             **When**     **Then**
  -------- -------------- --------------------- ------------ -----------------------
  AC-001   Country filter An audience is        A journey    Only candidates or
           applied at     configured with       executes     employees with country
           execution      country = \"United                 of record \"United
                          States\"                           States\" in JobDiva are
                                                             included in that
                                                             execution

  AC-002   Dynamic        A candidate meets the A journey    The candidate is
           inclusion of   audience inclusion    executes     included in the
           newly          criteria for the                   execution audience
           qualifying     first time after the               regardless of their
           candidate      audience was defined               status at audience
                                                             definition time

  AC-003   Exclusion rule An audience has an    A journey    Employees matching the
           applied        exclusion rule for    executes     exclusion rule are
                          employees on active                excluded from the
                          assignment                         execution even if they
                                                             satisfy the inclusion
                                                             criteria

  AC-004   JobDiva        The JobDiva Adapter   Audience     The system does not
           Adapter        Service is            resolution   execute the journey
           unavailable    unavailable at        is attempted with stale data; it
           --- execution  journey execution                  logs the failure and
           blocked        time                               retries on the next
                                                             scheduled cycle
  ----------------------------------------------------------------------------------

**Business Rules:** BR-003, BR-005,
BR-014 **Dependencies:** US-018 **Sprint Assignment:** Sprint 2

**US-021: Create and Manage User Lists for Fixed Audience Components**

**As a** User, **I want to** create named user lists and manage their
members, and reference those lists as fixed audience components in
audience definitions, **So that** I can include specific individuals in
a campaign regardless of dynamic segmentation results.

**Source Requirements:** FR-AM-015, FR-AM-016

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**       **When**     **Then**
  -------- -------------- --------------- ------------ -----------------------------
  AC-001   Create user    A User creates  The list is  The system creates the list
           list and add   a named user    saved        and all three members are
           members        list and adds                stored; the list is available
                          three members                for reference in audience
                                                       definitions

  AC-002   Reference user A User          The audience The audience includes all
           list in        references a    is evaluated current members of the user
           audience       user list in an at journey   list, in addition to any
                          audience        execution    members returned by dynamic
                          definition                   segmentation rules

  AC-003   Remove member  A User removes  The change   On the next journey
           from user list a member from a is saved     execution, the removed member
                          user list                    is no longer included via the
                                                       user list reference
  ----------------------------------------------------------------------------------

**Business Rules:** BR-003 **Dependencies:** US-018 **Sprint
Assignment:** Sprint 2

**US-022: Enforce Country-Specific Compliance Rules on Audience and
Delivery**

**As a** User, **I want to** the system to automatically enforce
country-specific compliance rules --- including delivery timing, content
constraints, and opt-out handling --- for all communications, **So
that** NEXA meets TCPA (US), GDPR (Europe), and CASL (Canada)
requirements without requiring manual compliance checks per message.

**Source Requirements:** FR-AM-018

**Acceptance Criteria:**

  ------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**           **When**    **Then**
  -------- -------------- ------------------- ----------- ----------------------------
  AC-001   US TCPA        A journey step      The         The system holds the message
           delivery       targets a US-based  dispatch    until the permitted delivery
           window         recipient and the   service     window opens; it does not
           enforced       current time is     processes   send the message outside
                          outside the         the message permitted hours
                          TCPA-permitted                  
                          delivery window                 

  AC-002   Opt-out        A recipient has     A journey   The system\'s
           recipient      opted out of SMS    step        Suppression/Compliance
           excluded       communications      attempts to Service blocks the delivery;
                                              send an SMS the message is logged as
                                              to that     suppressed with reason
                                              recipient   \"OPT_OUT\"; no SMS is sent

  AC-003   Opt-out        A recipient opts    The webhook Within the SLA defined in
           propagation    out via a Twilio    is received NFR-COM-001, the recipient
           within SLA     webhook callback    by NEXA     is added to the suppression
                                                          list and no further messages
                                                          are sent to them on any
                                                          subsequent journey execution
  ------------------------------------------------------------------------------------

**Business Rules:** BR-012, BR-004 **Dependencies:** US-020 **Sprint
Assignment:** Sprint 3

**US-023: Create and Manage Communication Templates**

**As a** User, **I want to** create, edit, activate/deactivate, and
delete SMS and Email communication templates, **So that** reusable
message content is managed centrally and can be referenced consistently
across multiple journeys.

**Source Requirements:** FR-TM-001, FR-TM-002, FR-TM-003, FR-TM-004

**Acceptance Criteria:**

  ---------------------------------------------------------------------------------
  **\#**   **Scenario**    **Given**         **When**    **Then**
  -------- --------------- ----------------- ----------- --------------------------
  AC-001   Create a valid  A User provides a They save   The system creates the
           template        channel (SMS or   the         template and it is
                           Email), name, and template    available for selection in
                           content                       journey step configuration

  AC-002   Delete template A User selects a  Deletion is The system permanently
           not referenced  template not      confirmed   removes the template
           by active       referenced by any             
           journey         active journey                
                           step                          

  AC-003   Delete template A User selects a  Deletion is The system blocks the
           referenced by   template          attempted   deletion and displays a
           active journey  referenced by an              message identifying the
           --- blocked     active journey                active journey referencing
                           step                          the template
  ---------------------------------------------------------------------------------

**Business Rules:** BR-010 **Dependencies:** US-001 **Sprint
Assignment:** Sprint 2

**US-024: Resolve Templates with Personalization Tokens at Delivery**

**As a** User, **I want to** include personalization tokens
(e.g., **{{first_name}}**, **{{project_name}}**) in templates that are
automatically substituted with each recipient\'s actual data at delivery
time, **So that** communications feel personal and relevant to each
recipient without manual per-recipient editing.

**Source Requirements:** FR-TM-005, FR-TM-006, FR-TM-007

**Acceptance Criteria:**

  -----------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**                                              **When**        **Then**
  -------- -------------- ------------------------------------------------------ --------------- ------------------------------------
  AC-001   Token          A template contains the token **{{first_name}}** and   The             The delivered message contains
           substituted at the recipient\'s name in JobDiva is \"Maria\"          communication   \"Maria\" in place
           delivery                                                              is delivered    of **{{first_name}}**; no
                                                                                                 literal **{{first_name}}** appears
                                                                                                 in the sent content

  AC-002   Multiple       A template                                             The             Both tokens are replaced with the
           tokens         contains **{{first_name}}** and **{{project_name}}**   communication   recipient\'s data in the final
           substituted                                                           is delivered to delivered message
                                                                                 a recipient     
                                                                                 with data       
                                                                                 \"John\" and    
                                                                                 \"Project       
                                                                                 Alpha\"         

  AC-003   Missing token  A template contains **{{project_name}}** but the       The             The system substitutes an empty
           data ---       recipient has no project assigned in JobDiva           communication   string or a configured fallback
           fallback                                                              is processed    value; the message is still
                                                                                                 delivered without exposing the raw
                                                                                                 token string to the recipient
  -----------------------------------------------------------------------------------------------------------------------------------

**Business Rules:** BR-005 **Dependencies:** US-023 **Sprint
Assignment:** Sprint 2

**US-025: Create and Manage Surveys**

**As a** User, **I want to** create, edit, activate/deactivate, and
delete surveys with questions of multiple types, **So that** I can
collect structured feedback from candidates and employees as part of
automated journeys.

**Source Requirements:** FR-SV-001, FR-SV-002, FR-SV-003, FR-SV-004

**Acceptance Criteria:**

  -------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**           **When**     **Then**
  -------- -------------- ------------------- ------------ ----------------------
  AC-001   Create a valid A User provides a   They save    The system creates the
           survey         survey name,        the survey   survey in Draft status
                          description,                     and it appears in the
                          language, and at                 survey grid
                          least one question               

  AC-002   Save survey    A User attempts to  Submission   The system displays a
           with no        save a survey       is attempted validation error and
           questions      without adding any               does not create the
           blocked        questions                        survey

  AC-003   Delete survey  A User selects a    Deletion is  The system blocks the
           associated     survey currently    attempted    deletion and displays
           with active    associated with an               a message indicating
           journey        active journey step              the survey is in use
           blocked                                         

  AC-004   All required   A User adds         The question The system offers at
           question types questions to a new  type         minimum:
           available      survey              selector is  single-choice,
                                              displayed    multiple-choice, free
                                                           text, and rating scale
                                                           question types
  -------------------------------------------------------------------------------

**Business Rules:** BR-010 **Dependencies:** US-001 **Sprint
Assignment:** Sprint 3

**US-026: Associate Surveys with Journey Steps and Deliver Personalized
Surveys**

**As a** User, **I want to** associate a survey with a journey step and
have the survey delivered to recipients with personalization tokens
resolved and in the correct language, **So that** recipients receive
contextually relevant surveys as part of automated workflows.

**Source Requirements:** FR-SV-011, FR-SV-012, FR-SV-013

**Acceptance Criteria:**

  --------------------------------------------------------------------------------------------------
  **\#**   **Scenario**      **Given**                      **When**     **Then**
  -------- ----------------- ------------------------------ ------------ ---------------------------
  AC-001   Survey associated An Active survey exists        A User adds  The user can select the
           with journey step                                a survey     active survey from the
                                                            step to a    available list; the step is
                                                            journey      saved with the survey
                                                                         association

  AC-002   Personalization   A survey contains the          The journey  The delivered survey
           tokens resolved   token **{{recipient_name}}**   delivers the contains \"Carlos\" in
           at delivery                                      survey step  place
                                                            to a         of **{{recipient_name}}**
                                                            recipient    
                                                            named        
                                                            \"Carlos\"   

  AC-003   Correct language  A survey has been created in   The journey  The Spanish-language survey
           survey delivered  Spanish and the recipient\'s   executes the is delivered to the
                             language preference is Spanish survey step  recipient

  AC-004   Inactive survey   A User attempts to save a      Save is      The system warns the user
           prevents journey  journey step referencing a     attempted    and prevents saving the
           save              survey in Inactive status                   step until an Active survey
                                                                         is selected
  --------------------------------------------------------------------------------------------------

**Business Rules:** BR-011, BR-005 **Dependencies:** US-025,
US-008 **Sprint Assignment:** Sprint 3

**US-027: Automatically Retry Failed Deliveries**

**As a** User, **I want to** the system to automatically retry failed
SMS and Email deliveries according to a configurable retry policy, **So
that** transient provider errors do not result in permanent delivery
failures without intervention.

**Source Requirements:** FR-EM-001, FR-EM-002

**Acceptance Criteria:**

  --------------------------------------------------------------------------------------
  **\#**   **Scenario**    **Given**        **When**   **Then**
  -------- --------------- ---------------- ---------- ---------------------------------
  AC-001   Transient       A communication  The        The system re-attempts delivery
           failure         delivery fails   failure is at the configured retry interval,
           triggers retry  due to a         detected   up to the maximum configured
                           transient Twilio            attempt count
                           or SendGrid                 
                           error                       

  AC-002   All retries     A delivery fails No further The system marks the delivery as
           exhausted ---   and all retry    retries    permanently failed and logs a
           final failure   attempts are     are        complete failure record including
           logged          exhausted        possible   recipient identifier, channel,
                                                       journey name, step identifier,
                                                       provider error code, error
                                                       message, attempt count, and UTC
                                                       timestamp

  AC-003   Non-retryable   A delivery fails The        The system does not retry the
           error not       with a           failure is delivery; it logs the failure as
           retried         non-retryable    logged     permanent with the reason code
                           error code                  
                           (e.g., invalid              
                           phone number)               
  --------------------------------------------------------------------------------------

**Business Rules:** BR-004, BR-013 **Dependencies:** US-010 **Sprint
Assignment:** Sprint 3

**US-028: View and Filter Error Log**

**As a** User, **I want to** view the error log and filter it by
journey, channel, date range, and error status, **So that** I can
investigate delivery failures and take corrective action.

**Source Requirements:** FR-EM-003

**Acceptance Criteria:**

  -------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**      **When**   **Then**
  -------- -------------- -------------- ---------- -----------------------------------
  AC-001   Error log      A User         The screen The system displays all logged
           displays       navigates to   loads      delivery failures with columns:
           required       the Error                 recipient identifier, channel,
           fields         Management log            journey name, step, error code,
                                                    error message, attempt count, and
                                                    timestamp

  AC-002   Filter by      A User applies The filter The system displays only delivery
           journey        a journey      is applied failures associated with the
                          filter                    selected journey

  AC-003   Filter by      A User applies The filter The system displays only SMS
           channel        an SMS channel is applied delivery failures
                          filter                    

  AC-004   No failures    A User applies The        The system displays an empty state
           match filter   filters that   filtered   message; no error is thrown
           --- empty      match no       view loads 
           state          records                   
  -------------------------------------------------------------------------------------

**Business Rules:** BR-008 **Dependencies:** US-027 **Sprint
Assignment:** Sprint 3

**2. Should Have --- Sprint 3--4**

*These stories add significant value but are not blockers for go-live.
They will be deferred if Sprint 1--3 capacity is at risk.*

**US-029: Bulk Edit Journeys (Status Change and Bulk Delete)**

**As a** User, **I want to** select multiple journeys and apply bulk
status changes or bulk delete inactive journeys, **So that** I can
manage large journey catalogs efficiently without performing repetitive
individual actions.

**Source Requirements:** FR-JM-010, FR-JM-011

**Deferral Justification:** Core single-record journey management
(US-008 through US-011) must be stable before adding bulk operations.
Bulk edit is a UX convenience that does not affect go-live viability.

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**             **When**    **Then**
  -------- -------------- --------------------- ----------- ------------------------
  AC-001   Bulk           A User selects three  The action  All three journeys
           deactivate     Active journeys and   is          transition to Inactive
           selected       initiates bulk        confirmed   status; the grid
           journeys       deactivate                        reflects the updated
                                                            statuses

  AC-002   Bulk delete    A User selects two    Deletion is Both journeys are
           inactive       Inactive journeys and confirmed   permanently removed from
           journeys       initiates bulk delete             the system

  AC-003   Bulk delete    A User attempts to    Deletion is The system blocks the
           blocked for    bulk delete a         attempted   operation and identifies
           active journey selection that                    which journeys are
                          includes at least one             Active; no deletions
                          Active journey                    occur
  ----------------------------------------------------------------------------------

**Business Rules:** BR-009 **Dependencies:** US-011 **Sprint
Assignment:** Sprint 3

**US-030: Bulk Edit and Bulk Delete Audiences**

**As a** User, **I want to** select multiple audiences and apply bulk
status changes or bulk delete audiences not assigned to active
journeys, **So that** I can maintain the audience catalog efficiently.

**Source Requirements:** FR-AM-009, FR-AM-010

**Deferral Justification:** Single-record audience management (US-018,
US-019) provides full functional coverage for go-live. Bulk operations
are a convenience layer.

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**               **When**    **Then**
  -------- -------------- ----------------------- ----------- ----------------------
  AC-001   Bulk           A User selects multiple The action  All selected audiences
           deactivate     Active audiences and    is          transition to Inactive
           audiences      initiates bulk          confirmed   status
                          deactivate                          

  AC-002   Bulk delete    A User selects multiple Deletion is All selected audiences
           unassigned     audiences not assigned  confirmed   are permanently
           audiences      to active journeys                  removed

  AC-003   Bulk delete    A User attempts to bulk Deletion is The system blocks the
           blocked for    delete a selection that attempted   operation and
           assigned       includes an audience                identifies the
           audience       assigned to an active               conflicting audience;
                          journey                             no deletions occur
  ----------------------------------------------------------------------------------

**Business Rules:** BR-002 **Dependencies:** US-019 **Sprint
Assignment:** Sprint 3

**US-031: Preview Estimated Audience Member Count Before Assignment**

**As a** User, **I want to** preview the estimated number of members
that an audience definition would resolve to before assigning it to a
journey, **So that** I can validate that my segmentation rules are
configured correctly before launching a campaign.

**Source Requirements:** FR-AM-017

**Deferral Justification:** Audiences function fully without preview ---
this is a validation convenience that reduces configuration errors but
is not a blocking feature.

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**            **When**    **Then**
  -------- -------------- -------------------- ----------- -------------------------
  AC-001   Preview shows  A User has           The preview The system queries the
           member count   configured an        request is  JobDiva Adapter\'s
                          audience definition  processed   current data and displays
                          and selects                      the estimated member
                          \"Preview Audience\"             count matching the
                                                           configured rules

  AC-002   Preview with   A User configures    Preview is  The system displays a
           conflicting    inclusion and        requested   count of zero and a
           rules --- zero exclusion rules that             warning that the current
           result         conflict (resulting              rules resolve to an empty
                          in no matching                   audience
                          members)                         

  AC-003   Preview        The JobDiva Adapter  Preview is  The system informs the
           unavailable    Service is           requested   user that live preview is
           --- Adapter    unavailable                      unavailable; the user may
           offline                                         still save the audience
                                                           definition
  ----------------------------------------------------------------------------------

**Business Rules:** BR-003, BR-005 **Dependencies:** US-020 **Sprint
Assignment:** Sprint 3

**US-032: Bulk Edit and Bulk Delete Surveys**

**As a** User, **I want to** select multiple surveys and apply bulk
status changes or bulk delete surveys not associated with active
journeys, **So that** I can manage the survey catalog at scale.

**Source Requirements:** FR-SV-009, FR-SV-010

**Deferral Justification:** Single-record survey management (US-025)
covers go-live requirements. Bulk survey operations address operational
efficiency in a mature catalog.

**Acceptance Criteria:**

  ---------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**                **When**    **Then**
  -------- -------------- ------------------------ ----------- --------------------
  AC-001   Bulk           A User selects multiple  The action  All selected surveys
           deactivate     Active surveys and       is          transition to
           surveys        initiates bulk           confirmed   Inactive status
                          deactivate                           

  AC-002   Bulk delete    A User selects surveys   Deletion is All selected surveys
           unassociated   not associated with      confirmed   are permanently
           surveys        active journeys                      removed

  AC-003   Bulk delete    A User attempts to bulk  Deletion is The system blocks
           blocked for    delete a selection       attempted   the operation and
           in-use survey  including a survey                   identifies the
                          associated with an                   conflicting survey
                          active journey                       
  ---------------------------------------------------------------------------------

**Business Rules:** BR-010 **Dependencies:** US-026 **Sprint
Assignment:** Sprint 4

**US-033: Configure Country-Specific Survey Delivery Rules**

**As a** User, **I want to** configure country-specific delivery rules
at the survey definition level, **So that** surveys respect regional
compliance constraints independently of the journey-level country rules.

**Source Requirements:** FR-SV-014

**Deferral Justification:** Journey-level country rules (US-013) provide
compliance coverage for go-live. Survey-level country rules add a
secondary compliance layer for complex multi-country survey deployments.

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**            **When**    **Then**
  -------- -------------- -------------------- ----------- -------------------------
  AC-001   Survey country A User defines a     The survey  The rule is stored and
           rule           country-specific     is saved    applied when the survey
           configured     rule on a survey                 is delivered to a
                          definition                       recipient in the
                                                           configured country

  AC-002   Survey country A survey with a      Delivery is The system applies the
           rule applied   country rule for     processed   Canada-specific
           at delivery    Canada is delivered              constraints to the survey
                          to a Canadian                    delivery
                          recipient                        
  ----------------------------------------------------------------------------------

**Business Rules:** BR-012 **Dependencies:** US-026 **Sprint
Assignment:** Sprint 4

**US-034: Generate Reports On Demand and Schedule Recurring Reports**

**As a** User, **I want to** view available reports, generate them on
demand with filter parameters, and schedule them for automatic recurring
generation, **So that** operational metrics are accessible without
manual intervention.

**Source Requirements:** FR-RP-001, FR-RP-002, FR-RP-003, FR-RP-004

**Deferral Justification:** Core platform delivery (journeys, audiences,
templates, error management) is required before reporting adds value.
Reports are a visibility layer built on top of operational data.

**Acceptance Criteria:**

  --------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**             **When**     **Then**
  -------- -------------- --------------------- ------------ ---------------------------
  AC-001   Reports grid   A User navigates to   The screen   The system displays a grid
           displayed      Reports               loads        listing all available
                                                             reports with columns:
                                                             report name, type, last
                                                             generated date, schedule
                                                             status, and created by

  AC-002   On-demand      A User selects a      Generation   The system produces the
           report         report definition,    is requested report output and displays
           generated      provides a valid date              it within the report detail
                          range and filters,                 view
                          and selects                        
                          \"Generate Report\"                

  AC-003   Invalid date   A User provides an    Generation   The system displays a
           range blocked  end date earlier than is attempted validation error and does
                          the start date                     not generate the report

  AC-004   Recurring      A User configures a   The schedule The system marks the report
           report         weekly recurrence     is saved     as Scheduled; on each
           scheduled      with a valid start                 weekly occurrence the
                          date                               system generates the report
                                                             and stores the output in
                                                             history
  --------------------------------------------------------------------------------------

**Business Rules:** BR-008 **Dependencies:** US-001 **Sprint
Assignment:** Sprint 3

**US-035: Search, Sort, and Filter Reports Grid**

**As a** User, **I want to** search, sort, and filter the reports grid
by name, type, date range, and schedule status, **So that** I can locate
specific reports efficiently in a growing report catalog.

**Source Requirements:** FR-RP-005, FR-RP-006, FR-RP-007

**Deferral Justification:** Reports grid is a secondary feature
dependent on US-034 being complete and populated.

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**            **When**   **Then**
  -------- -------------- -------------------- ---------- --------------------------
  AC-001   Search by name A User enters a      Results    The system displays only
                          search term in the   refresh    reports whose name matches
                          reports search field            the search term

  AC-002   Filter by      A User applies a     The filter The system displays only
           report type    type filter          is applied reports of the selected
                                                          type

  AC-003   Sort by last   A User clicks the    Sort is    The system re-orders the
           generated date \"Last Generated     applied    grid by last generated
                          Date\" column header            date in descending order
  ----------------------------------------------------------------------------------

**Business Rules:** BR-008 **Dependencies:** US-034 **Sprint
Assignment:** Sprint 3

**US-036: Journey Execution Report**

**As a** User, **I want to** generate a Journey Execution Report showing
execution metrics per journey, **So that** I can monitor how well each
journey is performing and identify delivery issues.

**Source Requirements:** FR-RP-008

**Deferral Justification:** Depends on journey execution data
accumulating after core journeys (US-008--US-016) are live.

**Acceptance Criteria:**

  ---------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**           **When**    **Then**
  -------- -------------- ------------------- ----------- -------------------------------
  AC-001   Report shows   A User generates a  The report  The output displays: journey
           required       Journey Execution   is          name, trigger date, audience
           fields         Report for a        generated   size, steps completed, delivery
                          journey with at                 success count, delivery failure
                          least one completed             count, and retry count for the
                          execution                       selected date range

  AC-002   No data for    A User selects a    The report  The system displays the report
           selected       date range with no  is          layout with zero-count values
           filters        executions          generated   and a message indicating no
                                                          data matches the selected
                                                          criteria
  ---------------------------------------------------------------------------------------

**Business Rules:** BR-008 **Dependencies:** US-034, US-015 **Sprint
Assignment:** Sprint 3

**US-037: Communication Delivery Report**

**As a** User, **I want to** generate a Communication Delivery Report
showing channel-level delivery metrics, **So that** I can assess the
effectiveness of SMS and Email delivery across all journeys.

**Source Requirements:** FR-RP-009

**Deferral Justification:** Requires sufficient delivery data from
production journeys and depends on US-034 infrastructure.

**Acceptance Criteria:**

  --------------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**              **When**    **Then**
  -------- -------------- ---------------------- ----------- ---------------------------
  AC-001   Report shows   A User generates a     The report  The output displays:
           required       Communication Delivery is          channel (SMS/Email),
           fields         Report for a date      generated   recipient count, delivered
                          range with delivery                count, failed count, retry
                          data                               count, and delivery date
                                                             range

  AC-002   Channel filter A User selects \"SMS\" The report  Only SMS delivery metrics
           applied        as a filter            is          are shown
                                                 generated   
  --------------------------------------------------------------------------------------

**Business Rules:** BR-004, BR-013 **Dependencies:** US-034 **Sprint
Assignment:** Sprint 4

**US-038: Notify Users on Exhausted Delivery Retries**

**As a** User, **I want to** receive a notification when a communication
delivery exhausts all retry attempts and remains unresolved, **So
that** I can take corrective action before the failed delivery affects
the recipient relationship.

**Source Requirements:** FR-EM-004

**Deferral Justification:** Automated retry (US-027) is the MVP
requirement. Notification is a proactive escalation layer that is
valuable but not blocking.

**Acceptance Criteria:**

  -----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**        **When**   **Then**
  -------- -------------- ---------------- ---------- -------------------------------
  AC-001   Notification   A delivery       The final  The system sends a notification
           sent on retry  exhausts all     failure is to the configured recipient(s)
           exhaustion     configured retry logged     indicating the journey, step,
                          attempts                    channel, and recipient
                                                      identifier of the unresolved
                                                      failure

  AC-002   No             A delivery fails The retry  No exhaustion notification is
           notification   but is           succeeds   sent
           for            successfully                
           recoverable    retried on the              
           failure        next attempt                
  -----------------------------------------------------------------------------------

**Business Rules:** BR-004 **Dependencies:** US-027 **Sprint
Assignment:** Sprint 4

**US-039: Manual Retry of Exhausted Failed Deliveries**

**As a** User, **I want to** manually trigger a retry for a specific
failed delivery after the automatic retry policy has been
exhausted, **So that** I can recover individual failed messages without
re-running an entire journey.

**Source Requirements:** FR-EM-005

**Deferral Justification:** Automatic retry (US-027) handles the
majority of failure recovery. Manual retry addresses edge cases
requiring human intervention and is more valuable once the error log
(US-028) is stable.

**Acceptance Criteria:**

  ----------------------------------------------------------------------------------
  **\#**   **Scenario**   **Given**            **When**    **Then**
  -------- -------------- -------------------- ----------- -------------------------
  AC-001   Manual retry   A User selects a     The retry   The system re-attempts
           succeeds       permanently failed   is executed delivery via the
                          delivery in the                  applicable channel
                          error log and                    provider; the error log
                          initiates a manual               is updated with the retry
                          retry                            outcome

  AC-002   Manual retry   A User initiates a   The retry   The system blocks the
           blocked for    manual retry for a   is          retry, logs the reason as
           opted-out      recipient who has    attempted   OPT_OUT, and displays a
           recipient      opted out                        message to the user; no
                                                           delivery is attempted

  AC-003   Provider       A User initiates a   The retry   The system logs the
           unavailable    manual retry but the is          failure outcome and marks
           during manual  provider is          attempted   the delivery as failed
           retry          temporarily                      again; the user is
                          unavailable                      informed of the result
  ----------------------------------------------------------------------------------

**Business Rules:** BR-004 **Dependencies:** US-027 **Sprint
Assignment:** Sprint 4

**3. Won\'t v1 --- Explicitly Out of Scope**

*These features are explicitly excluded from v1. Including them without
a formal scope change request is prohibited.*

  --------------------------------------------------------------------------------
  **ID**   **Feature**       **Reason Excluded**             **Future Trigger**
  -------- ----------------- ------------------------------- ---------------------
  W-001    Data Migration    Historical SenseHQ data will    v2 --- after MVP
           from SenseHQ      not be migrated to NEXA; legacy adoption is validated
                             system remains in parallel      and SenseHQ
                             during transition to protect    decommission is
                             operational continuity.         scheduled
                             Confirmed at kickoff. Manual    
                             reconfiguration in NEXA is      
                             expected.                       

  W-002    WhatsApp          Deferred by stakeholder         v2 --- if business
           Communication     decision at kickoff; MVP        demand is confirmed
           Channel           channel scope is explicitly     post-MVP
                             limited to SMS and Email.       
                             WhatsApp requires additional    
                             vendor contracts and compliance 
                             mapping not covered in this     
                             release.                        

  W-003    AI-Powered Voice  Explicitly excluded per SI-001  Future release ---
           Call Channel      §5; AI, MCP, and LLM            requires dedicated
                             capabilities are out of scope   feasibility study
                             for any release covered by      
                             FRS-001. Requires separate      
                             regulatory and technology       
                             evaluation.                     

  W-004    Chat Channel      Deferred at kickoff; MVP scope  v2 --- after
                             is limited to SMS and Email.    SMS/Email channel
                             Chat requires separate provider stability is
                             integration and compliance      confirmed
                             framework.                      

  W-005    Bidirectional     NEXA is read-only against       v2 or later ---
           JobDiva           JobDiva in MVP; no profile      requires JobDiva
           Write-Back        updates, status changes, or     vendor agreement and
                             notes may be written back to    data governance
                             the ATS. A formal change        review
                             control and JobDiva API         
                             write-access approval would be  
                             required.                       

  W-006    AI / ML / LLM     Explicitly excluded per SI-001  Future release ---
           Features          §5. AI and LLM capabilities are requires separate
                             not in scope for any release    architecture and
                             covered by FRS-001.             compliance evaluation

  W-007    Export            Validated as Nice-to-Have in    v2 --- if user demand
           Functionality     SI-001 §4 and deferred.         is confirmed in
           (Grid/Report      Feasibility to be assessed      post-launch feedback
           Export)           post-MVP based on user adoption cycle
                             feedback.                       

  W-008    Advanced          Complex analytics dashboards    v2 --- after basic
           Reporting and     and custom report builders      reporting (US-034
           Custom Report     require significantly more data through US-037)
           Builders          modeling and UX investment      stabilizes
                             beyond the scope of the MVP     
                             reporting module.               

  W-009    Multi-Tenant      The MVP serves a single         Future --- if the
           Support and       InspyrSolutions tenant against  platform is
           Additional        a single JobDiva instance.      productized or
           JobDiva           Multi-tenancy requires          additional business
           Environments      architectural changes to the    units are onboarded
                             data model and Adapter Service. 

  W-010    Multi-Region High Phased architecture plan defers Phase 3 architecture
           Availability      multi-region deployment to      --- triggered if
                             Phase 3 (Month 8+) per the SAD. regional availability
                             Not confirmed for MVP. ACA      requirements are
                             single-region SLA (99.95%) is   confirmed
                             sufficient for MVP.             

  W-011    Real-Time and     Hourly watermark-based delta    v2 --- if latency
           Incremental       sync is sufficient for MVP.     between JobDiva data
           JobDiva           Real-time sync requires a       changes and NEXA
           Synchronization   push-based integration or       audience updates is
                             sub-minute polling that was     identified as a
                             deferred per SI-001.            business problem
                                                             post-launch

  W-012    Audience Report   Should Have FR deferred to v2;  v2 --- after Audience
           (FR-RP-010)       audience analytics require a    Management
                             stable audience management      (US-018--US-022) has
                             foundation and sufficient data  been live for at
                             volume to be meaningful.        least one quarter

  W-013    Survey Response   Should Have FR deferred to v2;  v2 --- after Survey
           Report            survey response analytics       Management (US-025,
           (FR-RP-011)       require survey adoption data    US-026) has generated
                             from production.                measurable response
                                                             volume

  W-014    Report Output     Should Have FR deferred to v2;  v2 --- scheduled for
           History Retention report history is a convenience the first maintenance
           (FR-RP-012)       feature that requires           release after MVP
                             additional storage management   
                             and is not blocking for         
                             operational reporting.          
  --------------------------------------------------------------------------------

***Rule:** No Won\'t v1 item may enter a sprint without a formal scope
change request approved by Andrea Bermudez Bazurto (Product Owner) and
the InspyrSolutions Business Sponsor. Scope changes must be documented,
impact-assessed, and signed off before any development begins.*

**4. Definition of Done (Global)**

*All stories must meet every criterion below before being marked Done:*

**Functional Requirements**

-    All acceptance criteria have been fully implemented

-    Functional and non-functional requirements for the story have been
    met

-    Business rules applicable to the story have been correctly
    implemented

-    Edge cases and error scenarios have been addressed

**Development**

-    The solution complies with the team\'s coding standards and best
    practices (see Code Standards document)

-    Code is clean, maintainable, and free of temporary or debug code

-    The feature has been successfully integrated into the target branch

-    No known critical or high-severity defects remain open

**Quality Assurance**

-    Unit tests have been created or updated where applicable

-    Functional testing has been successfully completed

-    Regression testing confirms no impact on existing functionality

-    Integration testing has been completed where applicable

-    All acceptance criteria have been validated by QA

**Code Review**

-    The code has been peer-reviewed

-    All review comments have been addressed

-    The Pull Request has been approved and merged

**User Experience**

-    The implementation matches the approved designs and functional
    specifications from FRS-001

-    User interface elements are consistent with the application\'s
    design standards

-    Accessibility and responsiveness have been verified where
    applicable

**Documentation**

-    Technical documentation has been updated if required

-    API documentation has been updated if applicable

-    Release notes or user documentation have been updated when
    necessary

**Deployment Readiness**

-    The feature has been successfully deployed to the staging or
    testing environment

-    No deployment issues or blocking defects remain

-    The feature is ready for production release

**Product Validation**

-    The Product Owner (Andrea Bermudez Bazurto) has reviewed the
    implementation

-    The User Story has been formally accepted by the Product Owner

**A User Story is Done when all checkboxes above are satisfied.**

**5. Traceability to Functional Requirements Specification**

  ----------------------------------------------------------------------------------
  **FR ID**   **Requirement Summary**                       **Story   **Priority**
                                                            ID**      
  ----------- --------------------------------------------- --------- --------------
  FR-JM-001   Create a new journey                          US-008    Must Have

  FR-JM-002   Edit an existing journey                      US-009    Must Have

  FR-JM-003   Delete an inactive journey                    US-009    Must Have

  FR-JM-004   Activate a journey                            US-010    Must Have

  FR-JM-005   Deactivate an active journey                  US-010    Must Have

  FR-JM-006   Display journeys in main grid                 US-011    Must Have

  FR-JM-007   Search journeys by name                       US-011    Must Have

  FR-JM-008   Sort journeys grid by column                  US-011    Must Have

  FR-JM-009   Filter journeys grid                          US-011    Must Have

  FR-JM-010   Bulk edit journeys --- status change          US-029    Should Have

  FR-JM-011   Bulk delete inactive journeys                 US-029    Should Have

  FR-JM-012   Configure journey scheduling                  US-008    Must Have

  FR-JM-013   Enforce local time zone delivery              US-012    Must Have

  FR-JM-014   Configure country-specific journey rules      US-013    Must Have

  FR-JM-015   Configure language preferences within a       US-013    Must Have
              journey                                                 

  FR-JM-016   Maintain full journey execution history       US-015    Must Have

  FR-JM-017   View journey execution history                US-015    Must Have

  FR-JM-018   Visual flow editor using approved OSS library US-008    Must Have

  FR-JM-019   Persist journey flow definition in versioned  US-014    Must Have
              form                                                    

  FR-JM-020   Configure journey recurrence rules            US-016    Must Have

  FR-JM-021   Support eight priority journeys at go-live    US-017    Must Have

  FR-AM-001   Create audience with segmentation rules       US-018    Must Have

  FR-AM-002   Edit audience                                 US-018    Must Have

  FR-AM-003   Delete audience not assigned to active        US-018    Must Have
              journey                                                 

  FR-AM-004   Activate or deactivate audience               US-018    Must Have

  FR-AM-005   Display audiences in main grid                US-019    Must Have

  FR-AM-006   Search audiences                              US-019    Must Have

  FR-AM-007   Sort audiences grid                           US-019    Must Have

  FR-AM-008   Filter audiences grid                         US-019    Must Have

  FR-AM-009   Bulk edit audiences                           US-030    Should Have

  FR-AM-010   Bulk delete audiences                         US-030    Should Have

  FR-AM-011   Country-based segmentation rules              US-020    Must Have

  FR-AM-012   Language-based segmentation rules             US-020    Must Have

  FR-AM-013   Dynamic audience inclusion at execution       US-020    Must Have

  FR-AM-014   Dynamic audience exclusion at execution       US-020    Must Have

  FR-AM-015   Create and manage user lists                  US-021    Must Have

  FR-AM-016   Add, remove, update members in user list      US-021    Must Have

  FR-AM-017   Preview estimated audience member count       US-031    Should Have

  FR-AM-018   Enforce country-specific compliance rules     US-022    Must Have

  FR-SV-001   Create a new survey                           US-025    Must Have

  FR-SV-002   Edit an existing survey                       US-025    Must Have

  FR-SV-003   Delete a survey not associated with active    US-025    Must Have
              journey                                                 

  FR-SV-004   Activate or deactivate a survey               US-025    Must Have

  FR-SV-005   Display surveys in main grid                  US-025    Must Have

  FR-SV-006   Search surveys                                US-025    Must Have

  FR-SV-007   Sort surveys grid                             US-025    Must Have

  FR-SV-008   Filter surveys grid                           US-025    Must Have

  FR-SV-009   Bulk edit surveys                             US-032    Should Have

  FR-SV-010   Bulk delete surveys                           US-032    Should Have

  FR-SV-011   Associate survey with journey step            US-026    Must Have

  FR-SV-012   Survey personalization tokens                 US-026    Must Have

  FR-SV-013   Multi-language survey creation                US-026    Must Have

  FR-SV-014   Country-specific survey delivery rules        US-033    Should Have

  FR-SV-015   Minimum question types (4 types)              US-025    Must Have

  FR-RP-001   Reports grid                                  US-034    Should Have

  FR-RP-002   View report details                           US-034    Should Have

  FR-RP-003   Generate report on demand                     US-034    Should Have

  FR-RP-004   Schedule recurring report                     US-034    Should Have

  FR-RP-005   Search reports grid                           US-035    Should Have

  FR-RP-006   Sort reports grid                             US-035    Should Have

  FR-RP-007   Filter reports grid                           US-035    Should Have

  FR-RP-008   Journey Execution Report                      US-036    Should Have

  FR-RP-009   Communication Delivery Report                 US-037    Should Have

  FR-RP-010   Audience Report                               W-012     Won\'t v1

  FR-RP-011   Survey Response Report                        W-013     Won\'t v1

  FR-RP-012   Report output history retention               W-014     Won\'t v1

  FR-TM-001   Create communication template                 US-023    Must Have

  FR-TM-002   Edit template                                 US-023    Must Have

  FR-TM-003   Delete template not referenced by active      US-023    Must Have
              journey                                                 

  FR-TM-004   Activate or deactivate template               US-023    Must Have

  FR-TM-005   Journey steps reference centrally managed     US-024    Must Have
              templates                                               

  FR-TM-006   Personalization tokens in templates           US-024    Must Have

  FR-TM-007   Multi-language templates                      US-024    Must Have

  FR-CR-001   Centralized Content Repository                US-023    Must Have

  FR-CR-002   Upload and store content artifacts            US-023    Must Have

  FR-CR-003   Search Content Repository                     US-023    Must Have

  FR-CR-004   Organize Content Repository with              US-023    Must Have
              categories/tags                                         

  FR-CR-005   Delete Content Repository item not in active  US-023    Must Have
              use                                                     

  FR-CR-006   Reference Content Repository items in         US-024    Must Have
              journeys/templates                                      

  FR-EM-001   Automatic retry of failed deliveries          US-027    Must Have

  FR-EM-002   Log all delivery failures with full detail    US-027    Must Have

  FR-EM-003   View and filter error log                     US-028    Must Have

  FR-EM-004   Notify users on exhausted retries             US-038    Should Have

  FR-EM-005   Manual retry of exhausted failed deliveries   US-039    Should Have

  FR-AA-001   Authenticate via username and password        US-001    Must Have

  FR-AA-002   Issue JWT on successful authentication        US-001    Must Have

  FR-AA-003   Enforce session expiration on inactivity      US-002    Must Have

  FR-AA-004   Secure password hashing                       US-001    Must Have

  FR-AA-005   Enforce RBAC                                  US-004    Must Have

  FR-AA-006   Create, edit, deactivate, delete user         US-003    Must Have
              accounts (admin)                                        

  FR-AA-007   Assign and modify user roles (admin)          US-003    Must Have

  FR-AA-008   Audit log for key actions                     US-005    Must Have

  FR-AA-009   TLS in transit; encryption at rest            US-006    Must Have

  FR-AA-010   Retrieve secrets from Azure Key Vault         US-007    Must Have
  ----------------------------------------------------------------------------------

**FRS Coverage:** 78 of 78 functional requirements traced (100%)

**6. Document Control**

**Review & Approval**

  --------------------------------------------------------------------------------------
  **Role**             **Name**                   **Date**   **Status**   **Comments**
  -------------------- -------------------------- ---------- ------------ --------------
  Product Owner / BSA  Andrea Bermudez Bazurto               Pending      

  Tech Lead                                                  Pending      

  Business Sponsor     InspyrSolutions Leadership            Pending      
  --------------------------------------------------------------------------------------

**Version History**

  -----------------------------------------------------------------------------------------
  **Version**   **Date**     **Author**   **Changes**
  ------------- ------------ ------------ -------------------------------------------------
  1.0           2026-06-28   Andrea       Initial backlog --- 28 Must Have stories across
                             Bermudez (AI Sprint 1--3, 11 Should Have stories in Sprint
                             Assisted)    3--4, 14 Won\'t v1 items; full FR-XXX
                                          traceability from FRS-001; aligned to SAD-001
                                          architecture components

  -----------------------------------------------------------------------------------------

**7. Next Steps**

-    Review backlog with Tech Lead for sprint assignment feasibility and
    technical dependency validation --- Target: 2026-07-05

-    Confirm sprint velocity with development team based on actual team
    capacity --- Target: 2026-07-05

-    Validate Won\'t v1 list with InspyrSolutions Business Sponsor ---
    Target: 2026-07-07

-    Confirm eight priority journey configurations (US-017) are
    available for Sprint 3 --- Target: 2026-07-05

-    Confirm report layout specifications with Milgrim Bello and Amanda
    Hilsenbeck for US-036 and US-037 --- Target: 2026-07-10

-    Proceed to Roadmap (Align Phase) --- Target: 2026-07-08

-    Proceed to Work Breakdown Structure (WBS) --- Target: 2026-07-10

**Stage:** 05 --- Planning

**Document Control**

  -----------------------------------------------------------------------
  **Field**                 **Value**
  ------------------------- ---------------------------------------------
  Author                    Andrea Bermudez (AI Assisted)

  Approval Authority        Product Owner

  Status                    Draft

  Signature                 ⏳ Pending --- awaiting approval
  -----------------------------------------------------------------------

*--- End of document ---*
