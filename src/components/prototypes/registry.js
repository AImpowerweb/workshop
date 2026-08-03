import VoiceAssistant from './VoiceAssistant';
import EmergencyReport from './EmergencyReport';
import SmartwatchFeedback from './SmartwatchFeedback';
import EmotionTagging from './EmotionTagging';
import WorkplaceLog from './WorkplaceLog';
import FeedbackPlugin from './FeedbackPlugin';
import EvDashboard from './EvDashboard';
import FacialTurnTaking from './FacialTurnTaking';
import InterviewNotification from './InterviewNotification';
import InterviewTool from './InterviewTool';
import ExtendedTurnTaking from './ExtendedTurnTaking';
import MeetingCompanion from './MeetingCompanion';

// Maps a prototype `id` → a coded, interactive React component.
// When an id is registered here, the modal renders this component instead of the
// local design screenshot. Add more entries as you build out other screens.
export const prototypeComponents = {
  'voice-assistant': VoiceAssistant,
  'emergency-report': EmergencyReport,
  'smartwatch-feedback': SmartwatchFeedback,
  'emotion-popup': EmotionTagging,
  'workplace-log': WorkplaceLog,
  'feedback-plugin': FeedbackPlugin,
  'ev-dashboard': EvDashboard,
  'facial-turntaking': FacialTurnTaking,
  'interview-notification': InterviewNotification,
  'interview-tool': InterviewTool,
  'extended-turntaking': ExtendedTurnTaking,
  'meeting-companion': MeetingCompanion,
};
