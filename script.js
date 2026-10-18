// LAXFIT - Adaptive Lacrosse Position Finder
// Main application logic

class LacrossePositionFinder {
    constructor() {
        this.currentMode = null; // 'player' or 'coach'
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.questionBank = [];
        this.positionProfiles = {};
        this.weights = {};
        this.traits = {};
        this.availableQuestions = new Set();
        this.askedQuestions = new Set();

        this.initialize();
    }

    initialize() {
        this.loadQuestionBank();
        this.loadPositionProfiles();
        this.loadWeights();
        this.bindEvents();
        this.showPage('landing-page');
    }

    loadQuestionBank() {
        // Comprehensive question bank for adaptive lacrosse position finder
        this.questionBank = [
            // Primary preference questions
            {
                id: 'q1',
                text: "How do you most enjoy helping your team?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Creating passes that lead directly to goals", traits: ['passing_vision', 'feeding_instincts', 'playmaking', 'offensive_creativity'], positions: ['x_attack'], importance: 0.9 },
                    { text: "Scoring with accurate or powerful shots", traits: ['shooting_accuracy', 'shooting_power', 'finishing', 'offensive_threat'], positions: ['wing_attack', 'crease_attack'], importance: 0.9 },
                    { text: "Finishing quick passes around the goal", traits: ['quick_hands', 'reaction_speed', 'finish_crease', 'traffic_toughness'], positions: ['crease_attack'], importance: 0.9 },
                    { text: "Dodging defenders and creating offense from up top", traits: ['dodging', 'shot_creation', 'offensive_initiation', 'transition'], positions: ['offensive_midfield'], importance: 0.9 },
                    { text: "Covering lots of ground and helping on both ends", traits: ['endurance', 'versatility', 'transition', 'work_rate'], positions: ['two_way_midfield'], importance: 0.8 },
                    { text: "Shutting down opposing attackers", traits: ['defensive_footwork', 'body_positioning', 'defensive_patience', 'anticipation'], positions: ['ssdm', 'close_defense'], importance: 0.9 },
                    { text: "Using a long pole to defend and win ground balls", traits: ['long_pole_comfort', 'ground_balls', 'stick_checking', 'defensive_range'], positions: ['ls_midfield', 'close_defense'], importance: 0.8 },
                    { text: "Winning faceoffs and creating possessions", traits: ['faceoff_skill', 'hand_speed', 'reaction_time', 'explosiveness'], positions: ['faceoff_specialist'], importance: 0.9 },
                    { text: "Protecting the goal and organizing the defense", traits: ['goalie_interest', 'reaction_speed', 'hand_eye_coordination', 'communication'], positions: ['goalie'], importance: 0.9 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 } // Neutral option
                ],
                importance: 1.0,
                tags: ['primary_role_preference']
            },
            {
                id: 'q2',
                text: "Which part of offense sounds most appealing?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Running the offense from behind the net and finding cutters", traits: ['field_vision', 'passing_accuracy', 'offensive_spacing', 'patience'], positions: ['x_attack'], importance: 0.9 },
                    { text: "Getting open on the wing and finishing with a shot", traits: ['off_ball_movement', 'shooting_accuracy', 'quick_release', 'cutting'], positions: ['wing_attack'], importance: 0.9 },
                    { text: "Catching quick passes and scoring near the crease", traits: ['quick_hands', 'reaction_speed', 'finish_crease', 'rebound_awareness'], positions: ['crease_attack'], importance: 0.9 },
                    { text: "Dodging from the top of the box and shooting or feeding", traits: ['dodging', 'shot_creation', 'offensive_initiation', 'transition'], positions: ['offensive_midfield'], importance: 0.9 },
                    { text: "I prefer playing defense", traits: ['defensive_preference'], positions: ['ssdm', 'ls_midfield', 'close_defense'], importance: 0.8 },
                    { text: "I would rather be a goalie", traits: ['goalie_interest'], positions: ['goalie'], importance: 0.8 },
                    { text: "I haven't figured out what I like yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 1.0,
                tags: ['offensive_role_preference']
            },
            {
                id: 'q3',
                text: "What best describes your endurance and work rate?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "I can run hard for long stretches and recover quickly", traits: ['endurance', 'recovery_speed', 'work_rate'], positions: ['two_way_midfield', 'offensive_midfield', 'ls_midfield'], importance: 0.9 },
                    { text: "I have good short bursts but prefer shorter shifts", traits: ['explosiveness', 'quick_bursts'], positions: ['crease_attack', 'wing_attack', 'ssdm', 'faceoff_specialist'], importance: 0.8 },
                    { text: "I can run, but I prefer a specialized role with fewer extended runs", traits: ['specialized_preference'], positions: ['x_attack', 'wing_attack', 'goalie', 'faceoff_specialist'], importance: 0.7 },
                    { text: "I don't know yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.8,
                tags: ['endurance', 'work_rate']
            },
            {
                id: 'q4',
                text: "How would you describe your defensive instincts?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "I enjoy using footwork and body positioning to contain attackers", traits: ['defensive_footwork', 'body_positioning', 'spatial_awareness'], positions: ['ssdm', 'close_defense'], importance: 0.9 },
                    { text: "I like using stick checks and covering ground with a long pole", traits: ['stick_checking', 'long_pole_comfort', 'defensive_range'], positions: ['ls_midfield', 'ssdm'], importance: 0.8 },
                    { text: "I like defending midfielders with a short stick", traits: ['short_stick_defense', 'lateral_movement', 'anticipation'], positions: ['ssdm'], importance: 0.9 },
                    { text: "I prefer winning the ball and starting a fast break", traits: ['ground_balls', 'transition', 'clearing_ability'], positions: ['ls_midfield', 'two_way_midfield'], importance: 0.7 },
                    { text: "I don't enjoy defense very much", traits: ['offensive_preference'], positions: ['x_attack', 'wing_attack', 'crease_attack', 'offensive_midfield'], importance: 0.6 },
                    { text: "I haven't played defense enough to know", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.9,
                tags: ['defensive_style']
            },
            {
                id: 'q5',
                text: "How comfortable are you with contact and crowded situations?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "I thrive in contact and enjoy physical competition", traits: ['contact_toughness', 'physicality', 'traffic_toughness'], positions: ['crease_attack', 'ssdm', 'close_defense'], importance: 0.8 },
                    { text: "I'm okay with contact but prefer to avoid it when possible", traits: ['contact_tolerance'], positions: ['wing_attack', 'offensive_midfield', 'two_way_midfield'], importance: 0.6 },
                    { text: "I prefer to use finesse and positioning over physicality", traits: ['finesse', 'positioning', 'avoid_contact'], positions: ['x_attack', 'wing_attack'], importance: 0.7 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.7,
                tags: ['contact_preference']
            },
            {
                id: 'q6',
                text: "If your teammate is open and a defender is approaching, what would you naturally try to do?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Find the pass before the defender closes", traits: ['field_vision', 'passing_accuracy', 'decision_making', 'patience'], positions: ['x_attack', 'offensive_midfield'], importance: 0.9 },
                    { text: "Draw the defender and create a better passing lane", traits: ['dodging', 'field_vision', 'creativity'], positions: ['x_attack', 'wing_attack'], importance: 0.8 },
                    { text: "Attack the opening and shoot", traits: ['shooting_confidence', 'quick_decision', 'aggressiveness'], positions: ['wing_attack', 'crease_attack'], importance: 0.8 },
                    { text: "I am more likely to focus on defending or disrupting the next play", traits: ['defensive_awareness', 'transition_focus'], positions: ['ssdm', 'ls_midfield', 'two_way_midfield'], importance: 0.7 },
                    { text: "I'm still learning how to read the field", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.9,
                tags: ['offensive_decision_making']
            },
            {
                id: 'q7',
                text: "How would you describe your stick skills in tight spaces?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Excellent - I can handle the ball well in traffic", traits: ['stick_handling', 'quick_hands', 'traffic_toughness'], positions: ['crease_attack', 'x_attack'], importance: 0.9 },
                    { text: "Good - I can manage but prefer open space", traits: ['stick_handling'], positions: ['wing_attack', 'offensive_midfield'], importance: 0.7 },
                    { text: "Developing - I need more practice in tight spaces", traits: ['developing_stick_skills'], positions: ['all'], importance: 0.5 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.8,
                tags: ['stick_skills']
            },
            {
                id: 'q8',
                text: "What motivates you most on the field?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Setting up teammates for success", traits: ['team_orientation', 'playmaking', 'unselfishness'], positions: ['x_attack', 'offensive_midfield'], importance: 0.9 },
                    { text: "Scoring goals and being the finisher", traits: ['goal_scoring', 'individual_achievement'], positions: ['wing_attack', 'crease_attack'], importance: 0.9 },
                    { text: "Stopping the other team from scoring", traits: ['defensive_pride', 'shutdown_ability'], positions: ['ssdm', 'ls_midfield', 'close_defense'], importance: 0.9 },
                    { text: "Winning ground balls and possessions", traits: ['ground_ball_tenacity', 'possession_value'], positions: ['ls_midfield', 'ssdm', 'two_way_midfield', 'faceoff_specialist'], importance: 0.8 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.8,
                tags: ['motivation']
            },
            {
                id: 'q9',
                text: "How interested are you in playing with a long pole (defensive stick)?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Very interested - I love playing defense with a long pole", traits: ['long_pole_interest', 'defensive_enthusiasm'], positions: ['ls_midfield', 'close_defense'], importance: 0.9 },
                    { text: "Somewhat interested - I'd try it if given the chance", traits: ['long_pole_curiosity'], positions: ['ls_midfield', 'close_defense'], importance: 0.6 },
                    { text: "Not interested - I prefer short stick play", traits: ['short_stick_preference'], positions: ['x_attack', 'wing_attack', 'crease_attack', 'offensive_midfield', 'ssdm'], importance: 0.7 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.8,
                tags: ['stick_length_preference']
            },
            {
                id: 'q10',
                text: "How interested are you in taking faceoffs?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Very interested - I want to specialize in faceoffs", traits: ['faceoff_interest', 'specialist_aspiration'], positions: ['faceoff_specialist'], importance: 0.9 },
                    { text: "Somewhat interested - I'd take them occasionally", traits: ['faceoff_curiosity'], positions: ['two_way_midfield', 'ls_midfield'], importance: 0.6 },
                    { text: "Not interested - I prefer other aspects of the game", traits: ['faceoff_disinterest'], positions: ['all_except_faceoff'], importance: 0.5 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.7,
                tags: ['faceoff_interest']
            },
            {
                id: 'q11',
                text: "How interested are you in playing goalie?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Very interested - I want to play goalie", traits: ['goalie_interest', 'goalie_aspiration'], positions: ['goalie'], importance: 1.0 },
                    { text: "Somewhat interested - I'm curious about it", traits: ['goalie_curiosity'], positions: ['goalie'], importance: 0.6 },
                    { text: "Not interested - I prefer to play in the field", traits: ['field_player_preference'], positions: ['all_field_positions'], importance: 0.8 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.9,
                tags: ['goalie_interest']
            },
            {
                id: 'q12',
                text: "How would you describe your hand-eye coordination and reflexes?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Excellent - I react quickly to visual stimuli", traits: ['hand_eye_coordination', 'reflexes', 'reaction_speed'], positions: ['goalie', 'crease_attack', 'faceoff_specialist'], importance: 0.9 },
                    { text: "Good - I have decent coordination", traits: ['hand_eye_coordination'], positions: ['wing_attack', 'offensive_midfield'], importance: 0.6 },
                    { text: "Average - I'm working on improving it", traits: ['developing_coordination'], positions: ['all'], importance: 0.4 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.8,
                tags: ['coordination_reflexes']
            },
            {
                id: 'q13',
                text: "How do you typically make decisions under pressure?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "I stay calm and make smart, deliberate choices", traits: ['composure', 'decision_making', 'patience'], positions: ['x_attack', 'goalie', 'close_defense'], importance: 0.8 },
                    { text: "I act quickly and rely on my instincts", traits: ['quick_decisions', 'instincts', 'aggressiveness'], positions: ['wing_attack', 'crease_attack', 'ssdm'], importance: 0.7 },
                    { text: "I sometimes get rushed and make hurried choices", traits: ['pressure_challenges'], positions: ['all'], importance: 0.5 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.7,
                tags: ['decision_making_under_pressure']
            },
            {
                id: 'q14',
                text: "What's your approach to ground balls?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "I love the battle and fight for every ground ball", traits: ['ground_ball_tenacity', 'toughness', 'possession_value'], positions: ['ls_midfield', 'ssdm', 'two_way_midfield', 'faceoff_specialist'], importance: 0.9 },
                    { text: "I'll get them when I can but don't seek them out", traits: ['ground_ball_opportunistic'], positions: ['wing_attack', 'offensive_midfield'], importance: 0.5 },
                    { text: "I prefer to let others get them and focus on my role", traits: ['ground_ball_avoidance'], positions: ['x_attack', 'wing_attack', 'crease_attack'], importance: 0.4 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.8,
                tags: ['ground_ball_approach']
            },
            {
                id: 'q15',
                text: "How important is scoring versus setting up teammates?",
                mode: ['player', 'coach'],
                answers: [
                    { text: "Setting up teammates is more important to me", traits: ['playmaking_orientation', 'unselfishness', 'team_first'], positions: ['x_attack'], importance: 0.9 },
                    { text: "Scoring and setting up are equally important", traits: ['balanced_offensive_approach'], positions: ['wing_attack', 'offensive_midfield'], importance: 0.7 },
                    { text: "Scoring is more important to me than setting up", traits: ['scoring_orientation'], positions: ['wing_attack', 'crease_attack'], importance: 0.8 },
                    { text: "I'm not sure yet", traits: [], positions: [], importance: 0.1 }
                ],
                importance: 0.8,
                tags: ['offensive_orientation']
            }
        ];
    }

    loadPositionProfiles() {
        // Define position profiles with their key traits and weights
        this.positionProfiles = {
            'x_attack': {
                name: 'X Attackman',
                category: 'Attack',
                description: 'The offensive playmaker who operates behind the goal.',
                keyTraits: ['field_vision', 'passing_accuracy', 'feeding_instincts', 'offensive_spacing', 'patience', 'creativity', 'offensive_creativity', 'team_orientation', 'playmaking', 'unselfishness'],
                idealFor: ['playmaking', 'vision', 'team_oriented_offense']
            },
            'wing_attack': {
                name: 'Wing Attackman',
                category: 'Attack',
                description: 'The attackman who operates on the left or right side of the goal and creates scoring threats.',
                keyTraits: ['shooting_accuracy', 'shooting_power', 'quick_release', 'off_ball_movement', 'cutting', 'finishing', 'offensive_threat', 'goal_scoring', 'individual_achievement', 'shooting_confidence'],
                idealFor: ['scoring', 'shooting', 'wing_play']
            },
            'crease_attack': {
                name: 'Crease Attackman',
                category: 'Attack',
                description: 'The attackman who works close to the goal and around the crease.',
                keyTraits: ['quick_hands', 'reaction_speed', 'catch_in_traffic', 'finish_crease', 'rebound_awareness', 'toughness', 'contact_toughness', 'physicality', 'traffic_toughness', 'crease_play', 'quick_finishes', 'traffic_play'],
                idealFor: ['crease_play', 'quick_finishes', 'traffic_play']
            },
            'offensive_midfield': {
                name: 'Offensive Midfielder',
                category: 'Midfield',
                description: 'An attack-minded midfielder who creates offense from the top of the box, wings, and transition opportunities.',
                keyTraits: ['dodging', 'shot_creation', 'offensive_initiation', 'transition', 'shot_selection', 'field_vision', 'passing_accuracy', 'decision_making', 'creativity', 'team_orientation', 'playmaking'],
                idealFor: ['offensive_initiation', 'dodging', 'transition_offense']
            },
            'two_way_midfield': {
                name: 'Two-Way Midfielder',
                category: 'Midfield',
                description: 'A versatile midfielder who contributes on both offense and defense.',
                keyTraits: ['endurance', 'recovery_speed', 'work_rate', 'versatility', 'ground_balls', 'transition', 'consistent_effort', 'ground_ball_tenacity', 'possession_value'],
                idealFor: ['versatility', 'endurance', 'two_way_play']
            },
            'ssdm': {
                name: 'Short-Stick Defensive Midfielder (SSDM)',
                category: 'Midfield',
                description: 'A defensive specialist using a short stick to defend opposing midfielders.',
                keyTraits: ['defensive_footwork', 'lateral_movement', 'body_positioning', 'anticipation', 'communication', 'ground_balls', 'defensive_patience', 'spatial_awareness', 'defensive_pride', 'shutdown_ability', 'short_stick_defense'],
                idealFor: ['defensive_midfield', 'short_stick_defense', 'ground_ball_warrior']
            },
            'ls_midfield': {
                name: 'Long-Stick Midfielder (LSM)',
                category: 'Midfield',
                description: 'A defensive-minded midfielder who carries a long pole and contributes to defense, ground balls, and transition.',
                keyTraits: ['long_pole_comfort', 'ground_balls', 'stick_checking', 'defensive_range', 'transition', 'long_pole_interest', 'defensive_enthusiasm', 'ground_ball_tenacity', 'possession_value'],
                idealFor: ['long_pole_defense', 'ground_balls', 'ls_role']
            },
            'faceoff_specialist': {
                name: 'Faceoff Specialist (FOGO)',
                category: 'Midfield',
                description: 'A specialized faceoff player, commonly called a FOGO when they face off and then get off the field.',
                keyTraits: ['hand_speed', 'reaction_time', 'faceoff_technique', 'explosiveness', 'ground_ball_after_clamp', 'faceoff_interest', 'specialist_aspiration', 'faceoff_curiosity'],
                idealFor: ['faceoffs', 'possession_wins', 'specialist']
            },
            'close_defense': {
                name: 'Close Defenseman',
                category: 'Defense',
                description: 'A defender who specializes in protecting the defensive end and matching up with opposing attackmen.',
                keyTraits: ['defensive_footwork', 'body_positioning', 'stick_checking', 'patience', 'communication', 'spatial_awareness', 'defensive_patience', 'defensive_pride', 'shutdown_ability'],
                idealFor: ['settled_defense', 'one_on_one_defense', 'close_defense']
            },
            'goalie': {
                name: 'Goalie',
                category: 'Goalie',
                description: 'A specialized position responsible for stopping shots, communicating defensive assignments, and starting clears.',
                keyTraits: ['reflexes', 'hand_eye_coordination', 'reaction_speed', 'courage', 'concentration', 'communication', 'goalie_interest', 'goalie_aspiration', 'goalie_curiosity', 'hand_eye_coordination'],
                idealFor: ['goalie', 'shot_stopping', 'defensive_organization']
            }
        };
    }

    loadWeights() {
        // Define weights for different traits and how they contribute to positions
        // Using a more comprehensive weighting system
        this.weights = {
            // Offensive traits
            'field_vision': { x_attack: 0.9, offensive_midfield: 0.6, wing_attack: 0.3, crease_attack: 0.4, two_way_midfield: 0.2 },
            'passing_accuracy': { x_attack: 0.9, offensive_midfield: 0.7, two_way_midfield: 0.5, wing_attack: 0.4 },
            'feeding_instincts': { x_attack: 1.0, offensive_midfield: 0.8 },
            'offensive_spacing': { x_attack: 0.8, offensive_midfield: 0.6, wing_attack: 0.3 },
            'patience': { x_attack: 0.7, offensive_midfield: 0.5, crease_attack: 0.4, close_defense: 0.3 },
            'creativity': { x_attack: 0.8, offensive_midfield: 0.6, wing_attack: 0.5, crease_attack: 0.3 },
            'offensive_creativity': { x_attack: 0.9, offensive_midfield: 0.7 },
            'team_orientation': { x_attack: 0.8, offensive_midfield: 0.6 },
            'playmaking': { x_attack: 0.9, offensive_midfield: 0.7 },
            'unselfishness': { x_attack: 0.8, offensive_midfield: 0.6 },

            'shooting_accuracy': { wing_attack: 0.9, crease_attack: 0.6, offensive_midfield: 0.7, x_attack: 0.4 },
            'shooting_power': { wing_attack: 0.8, offensive_midfield: 0.6, crease_attack: 0.4, x_attack: 0.3 },
            'quick_release': { wing_attack: 0.8, crease_attack: 0.9, offensive_midfield: 0.5, x_attack: 0.3 },
            'off_ball_movement': { wing_attack: 0.9, crease_attack: 0.6, offensive_midfield: 0.5, x_attack: 0.2 },
            'cutting': { wing_attack: 0.8, crease_attack: 0.4 },
            'finishing': { wing_attack: 0.7, crease_attack: 0.9, offensive_midfield: 0.4, x_attack: 0.2 },
            'offensive_threat': { wing_attack: 0.9, crease_attack: 0.6 },
            'goal_scoring': { wing_attack: 0.9, crease_attack: 0.8 },
            'individual_achievement': { wing_attack: 0.8, crease_attack: 0.6 },
            'shooting_confidence': { wing_attack: 0.8, crease_attack: 0.6 },

            'quick_hands': { crease_attack: 0.9, x_attack: 0.5, offensive_midfield: 0.4 },
            'reaction_speed': { crease_attack: 0.8, goalie: 0.9, faceoff_specialist: 0.8, wing_attack: 0.4 },
            'catch_in_traffic': { crease_attack: 0.8 },
            'finish_crease': { crease_attack: 0.9 },
            'rebound_awareness': { crease_attack: 0.7 },
            'toughness': { crease_attack: 0.6, close_defense: 0.5, ssdm: 0.4, wing_attack: 0.2 },
            'contact_toughness': { crease_attack: 0.8, ssdm: 0.6, close_defense: 0.5 },
            'physicality': { crease_attack: 0.7, ssdm: 0.6, close_defense: 0.5 },
            'traffic_toughness': { crease_attack: 0.7, ssdm: 0.6, close_defense: 0.5 },

            'dodging': { offensive_midfield: 0.9, wing_attack: 0.6, x_attack: 0.4 },
            'shot_creation': { offensive_midfield: 0.8, wing_attack: 0.5, x_attack: 0.3 },
            'offensive_initiation': { offensive_midfield: 0.9, two_way_midfield: 0.5 },
            'transition': { offensive_midfield: 0.6, two_way_midfield: 0.8, ls_midfield: 0.7, x_attack: 0.2 },
            'shot_selection': { offensive_midfield: 0.7, two_way_midfield: 0.5 },

            'endurance': { two_way_midfield: 0.9, offensive_midfield: 0.7, ls_midfield: 0.8 },
            'recovery_speed': { two_way_midfield: 0.8, offensive_midfield: 0.6, ls_midfield: 0.7 },
            'work_rate': { two_way_midfield: 0.8, offensive_midfield: 0.6, ls_midfield: 0.7 },
            'versatility': { two_way_midfield: 1.0, offensive_midfield: 0.6, ls_midfield: 0.5 },
            'ground_balls': { two_way_midfield: 0.7, ls_midfield: 0.9, ssdm: 0.8, close_defence: 0.6, faceoff_specialist: 0.5 },
            'consistent_effort': { two_way_midfield: 0.8, offensive_midfield: 0.6, ls_midfield: 0.7 },
            'ground_ball_tenacity': { ls_midfield: 0.9, ssdm: 0.8, two_way_midfield: 0.6, faceoff_specialist: 0.7 },
            'possession_value': { ls_midfield: 0.8, ssdm: 0.7, two_way_midfield: 0.6, faceoff_specialist: 0.6 },

            'defensive_footwork': { ssdm: 0.9, close_defense: 0.8, ls_midfield: 0.6 },
            'lateral_movement': { ssdm: 0.8, close_defense: 0.7 },
            'body_positioning': { ssdm: 0.8, close_defense: 0.9 },
            'anticipation': { ssdm: 0.7, close_defense: 0.8, ls_midfield: 0.6, faceoff_specialist: 0.5 },
            'defensive_patience': { ssdm: 0.7, close_defense: 0.8, ls_midfield: 0.6 },
            'defensive_pride': { ssdm: 0.8, close_defense: 0.7, ls_midfield: 0.5 },
            'shutdown_ability': { ssdm: 0.8, close_defense: 0.7, ls_midfield: 0.5 },
            'short_stick_defense': { ssdm: 0.9 },
            'communication': { ssdm: 0.7, close_defense: 0.8, ls_midfield: 0.6, goalie: 0.9, x_attack: 0.5, offensive_midfield: 0.4 },

            'ground_balls_def': { ssdm: 0.8, ls_midfield: 0.7, close_defense: 0.6 },
            'stick_checking': { ssdm: 0.6, ls_midfield: 0.8, close_defense: 0.7 },
            'toughness_def': { ssdm: 0.5, close_defense: 0.6, ls_midfield: 0.4 },

            'long_pole_comfort': { ls_midfield: 0.9, close_defense: 0.7 },
            'long_pole_interest': { ls_midfield: 0.9, close_defense: 0.7 },
            'defensive_enthusiasm': { ls_midfield: 0.8, close_defense: 0.6 },
            'defensive_range': { ls_midfield: 0.8, close_defense: 0.6 },

            'hand_speed': { faceoff_specialist: 0.9, goalie: 0.7, crease_attack: 0.5 },
            'reaction_time': { faceoff_specialist: 0.8, goalie: 0.9, crease_attack: 0.6 },
            'faceoff_technique': { faceoff_specialist: 1.0 },
            'explosiveness': { faceoff_specialist: 0.7, wing_attack: 0.5, crease_attack: 0.4 },
            'ground_ball_after_clamp': { faceoff_specialist: 0.8, ls_midfield: 0.6 },

            'reflexes': { goalie: 0.9, crease_attack: 0.4, wing_attack: 0.3, faceoff_specialist: 0.5 },
            'hand_eye_coordination': { goalie: 0.9, crease_attack: 0.5, wing_attack: 0.4, faceoff_specialist: 0.5 },
            'courage': { goalie: 0.8 },
            'concentration': { goalie: 0.8, crease_attack: 0.4 },
            'goalie_interest': { goalie: 1.0 },
            'goalie_aspiration': { goalie: 0.9 },
            'goalie_curiosity': { goalie: 0.6 },
            'goalie_communication': { goalie: 1.0 },

            // Experience and learning traits
            'developing_stick_skills': { all: 0.3 },
            'developing_coordination': { all: 0.3 },
            'pressure_challenges': { all: 0.2 },
            'ground_ball_opportunistic': { wing_attack: 0.4, offensive_midfield: 0.4 },
            'ground_ball_avoidance': { x_attack: 0.3, wing_attack: 0.3, crease_attack: 0.3 },
            'facebook_disinterest': { all_except_faceoff: 0.4 },
            'field_player_preference': { all_field_positions: 0.5 },
            'offensive_preference': { x_attack: 0.5, wing_attack: 0.5, crease_attack: 0.5, offensive_midfield: 0.4 },
            'specialized_preference': { x_attack: 0.4, wing_attack: 0.4, goalie: 0.5, faceoff_specialist: 0.5 },
            'contact_tolerance': { wing_attack: 0.4, offensive_midfield: 0.4, two_way_midfield: 0.3 },
            'finesse': { x_attack: 0.5, wing_attack: 0.4 },
            'positioning': { x_attack: 0.4, wing_attack: 0.3 },
            'avoid_contact': { x_attack: 0.4, wing_attack: 0.3 },
            'defensive_awareness': { ssdm: 0.5, ls_midfield: 0.5, two_way_midfield: 0.4 },
            'transition_focus': { ssdm: 0.4, ls_midfield: 0.4, two_way_midfield: 0.3 }
        };

        // Set default weight of 0.1 for any trait-position combination not explicitly defined
        this.defaultWeight = 0.1;
    }

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showPage('mode-selection');
        });

        document.getElementById('stick-lab-btn').addEventListener('click', () => {
            this.showPage('stick-lab-nav');
        });

        document.getElementById('player-mode-btn').addEventListener('click', () => {
            this.currentMode = 'player';
            this.startQuiz();
        });

        document.getElementById('coach-mode-btn').addEventListener('click', () => {
            this.currentMode = 'coach';
            this.startQuiz();
        });

        document.getElementById('prev-btn').addEventListener('click', () => {
            this.goToPreviousQuestion();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.goToNextQuestion();
        });

        document.getElementById('retake-btn').addEventListener('click', () => {
            this.resetQuiz();
            this.showPage('mode-selection');
        });

        document.getElementById('review-btn').addEventListener('click', () => {
            this.showReview();
        });

        document.getElementById('print-btn').addEventListener('click', () => {
            window.print();
        });

        document.getElementById('new-assessment-btn').addEventListener('click', () => {
            this.resetQuiz();
            this.showPage('mode-selection');
        });
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.askedQuestions = new Set();
        this.availableQuestions = new Set(this.questionBank.map(q => q.id));
        this.showPage('quiz-page');
        this.loadQuestion();
    }

    loadQuestion() {
        // Filter questions based on mode and availability
        const availableQuestionIds = [...this.availableQuestions].filter(id =>
            !this.askedQuestions.has(id)
        );

        if (availableQuestionIds.length === 0) {
            this.showResults();
            return;
        }

        // Select next question using adaptive algorithm
        const nextQuestionId = this.chooseNextQuestion(availableQuestionIds);
        const question = this.questionBank.find(q => q.id === nextQuestionId);

        if (!question) {
            this.showResults();
            return;
        }

        // Mark question as asked
        this.askedQuestions.add(nextQuestionId);
        this.availableQuestions.delete(nextQuestionId);

        // Display question
        this.displayQuestion(question);
    }

    chooseNextQuestion(availableQuestionIds) {
        // Simple adaptive algorithm: for now, just pick the first available
        // In a full implementation, this would use entropy-based selection
        return availableQuestionIds[0];
    }

    displayQuestion(question) {
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / Math.min(10, this.questionBank.length)) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('question-counter').textContent = `Question ${this.currentQuestionIndex + 1}`;

        // Display question text
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = `
            <div class="question-text">${question.text}</div>
            <div class="answer-options">
                ${question.answers.map((answer, index) => `
                    <button class="answer-btn" data-index="${index}">
                        ${answer.text}
                    </button>
                `).join('')}
            </div>
        `;

        // Add event listeners to answer buttons
        questionContainer.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.selectAnswer(button, question);
            });
        });
    }

    selectAnswer(button, question) {
        // Remove selection from all buttons
        button.parentElement.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selection to clicked button
        button.classList.add('selected');

        // Store answer
        const answerIndex = parseInt(button.dataset.index);
        const selectedAnswer = question.answers[answerIndex];
        this.answers[question.id] = {
            text: selectedAnswer.text,
            traits: selectedAnswer.traits,
            positions: selectedAnswer.positions
        };

        // Move to next question
        this.currentQuestionIndex++;
        this.loadQuestion();
    }

    goToPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion();
        }
    }

    goToNextQuestion() {
        this.loadQuestion();
    }

    showResults() {
        this.showPage('results-page');
        this.displayResults();
    }

    displayResults() {
        const resultsContainer = document.getElementById('results-content');

        // Calculate position scores
        const positionScores = this.calculatePositionScores();

        // Sort positions by score
        const sortedPositions = Object.entries(positionScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

        // Display primary recommendation
        if (sortedPositions.length > 0) {
            const [topPositionId, topScore] = sortedPositions[0];
            const positionInfo = this.positionProfiles[topPositionId];

            resultsContainer.innerHTML = `
                <div class="position-card">
                    <h3>${positionInfo.name}</h3>
                    <p><strong>Category:</strong> ${positionInfo.category}</p>
                    <p>${positionInfo.description}</p>
                    <div class="compatibility-bar">
                        <div class="compatibility-fill" style="width: ${Math.min(topScore * 100, 100)}%"></div>
                    </div>
                    <div class="compatibility-label">
                        <span>Compatibility Score</span>
                        <span>${(topScore * 100).toFixed(1)}%</span>
                    </div>
                    <p><strong>Why it fits you:</strong> Based on your answers, you show strong tendencies toward ${positionInfo.name.toLowerCase()} characteristics.</p>
                </div>

                <div class="strengths-section">
                    <h3>Your Strengths</h3>
                    <ul class="strengths-list">
                        <li>Strong positional awareness</li>
                        <li>Good communication skills</li>
                        <li>Athletic versatility</li>
                    </ul>
                </div>

                <div class="development-section">
                    <h3>Areas for Development</h3>
                    <ul class="development-list">
                        <li>Position-specific skills</li>
                        <li>Game situational awareness</li>
                        <li>Consistent practice habits</li>
                    </ul>
                </div>

                <div class="next-steps-section">
                    <h3>Suggested Next Steps</h3>
                    <ul class="next-steps-list">
                        <li>Practice fundamental skills daily</li>
                        <li>Watch professional players in this position</li>
                        <li>Seek feedback from coaches</li>
                    </ul>
                </div>
            `;

            // Display alternative positions
            if (sortedPositions.length > 1) {
                const alternativesHtml = sortedPositions.slice(1, 4).map(([posId, score]) => {
                    const posInfo = this.positionProfiles[posId];
                    return `
                        <div class="position-card">
                            <h3>${posInfo.name}</h3>
                            <p><strong>Category:</strong> ${posInfo.category}</p>
                            <div class="compatibility-bar">
                                <div class="compatibility-fill" style="width: ${Math.min(score * 100, 100)}%"></div>
                            </div>
                            <div class="compatibility-label">
                                <span>Alternative Option</span>
                                <span>${(score * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    `;
                }).join('');

                resultsContainer.innerHTML += `<div class="alternatives-section"><h2>Alternative Positions</h2>${alternativesHtml}</div>`;
            }
        } else {
            resultsContainer.innerHTML = `<p>Unable to determine a position based on your answers. Please try again.</p>`;
        }
    }

    calculatePositionScores() {
        const scores = {};

        // Initialize all positions with 0 score
        Object.keys(this.positionProfiles).forEach(posId => {
            scores[posId] = 0;
        });

        // Calculate scores based on answers
        Object.values(this.answers).forEach(answer => {
            answer.traits.forEach(trait => {
                Object.keys(this.weights[trait] || {}).forEach(posId => {
                    if (scores[posId] !== undefined) {
                        scores[posId] += this.weights[trait][posId] || 0;
                    }
                });
            });
        });

        // Normalize scores (simple approach)
        const maxScore = Math.max(...Object.values(scores));
        if (maxScore > 0) {
            Object.keys(scores).forEach(posId => {
                scores[posId] = scores[posId] / maxScore;
            });
        }

        return scores;
    }

    showReview() {
        // TODO: Implement answer review functionality
        alert('Review feature coming soon!');
    }

    resetQuiz() {
        this.currentMode = null;
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.questionBank = [];
        this.positionProfiles = {};
        this.weights = {};
        this.traits = {};
        this.availableQuestions = new Set();
        this.askedQuestions = new Set();

        this.initialize();
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        document.getElementById(pageId).classList.add('active');

        // Update button states
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (pageId === 'quiz-page') {
            prevBtn.disabled = this.currentQuestionIndex === 0;
            nextBtn.disabled = false;
        } else {
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LacrossePositionFinder();
});