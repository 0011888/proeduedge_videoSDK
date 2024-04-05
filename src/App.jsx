import {MeetingProvider} from '@videosdk.live/react-sdk';
import {useEffect} from 'react';
import {useState} from 'react';
// @ts-ignore
import {MeetingAppProvider} from './context/MeetingAppContextDef';
import {MeetingContainer} from './meeting/MeetingContainer';
import {LeaveScreen} from './components/screens/LeaveScreen';
import {JoiningScreen} from './components/screens/JoiningScreen';

function VideoConference() {
	const [token, setToken] = useState('');
	const [meetingId, setMeetingId] = useState('');
	const [participantName, setParticipantName] = useState('');
	const [micOn, setMicOn] = useState(false);
	const [webcamOn, setWebcamOn] = useState(false);
	const [customAudioStream, setCustomAudioStream] = useState(null);
	const [customVideoStream, setCustomVideoStream] = useState(null);
	const [isMeetingStarted, setMeetingStarted] = useState(false);
	const [isMeetingLeft, setIsMeetingLeft] = useState(false);

	const isMobile = window.matchMedia(
		'only screen and (max-width: 768px)'
	).matches;

	useEffect(() => {
		if (isMobile) {
			window.onbeforeunload = () => {
				return 'Are you sure you want to exit?';
			};
		}
	}, [isMobile]);

	return (
		<>
			<MeetingAppProvider>
				{isMeetingStarted ? (
					<MeetingProvider
						config={{
							meetingId,
							micEnabled: micOn,
							webcamEnabled: webcamOn,
							name: participantName ? participantName : 'TestUser',
							multiStream: true,
							//@ts-ignore
							customCameraVideoTrack: customVideoStream,
							//@ts-ignore
							customMicrophoneAudioTrack: customAudioStream,
						}}
						token={token}
						reinitialiseMeetingOnConfigChange={true}
						joinWithoutUserInteraction={true}
					>
						<MeetingContainer
							onMeetingLeave={() => {
								setToken('');
								setMeetingId('');
								setParticipantName('');
								setWebcamOn(false);
								setMicOn(false);
								setMeetingStarted(false);
							}}
							setIsMeetingLeft={setIsMeetingLeft}
						/>
					</MeetingProvider>
				) : isMeetingLeft ? (
					<LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
				) : (
					<JoiningScreen
						participantName={participantName}
						setParticipantName={setParticipantName}
						setMeetingId={setMeetingId}
						setToken={setToken}
						micOn={micOn}
						setMicOn={setMicOn}
						webcamOn={webcamOn}
						setWebcamOn={setWebcamOn}
						customAudioStream={customAudioStream}
						setCustomAudioStream={setCustomAudioStream}
						customVideoStream={customVideoStream}
						setCustomVideoStream={setCustomVideoStream}
						onClickStartMeeting={() => {
							setMeetingStarted(true);
						}}
						startMeeting={isMeetingStarted}
						setIsMeetingLeft={setIsMeetingLeft}
					/>
				)}
			</MeetingAppProvider>
		</>
	);
}

export default VideoConference;
