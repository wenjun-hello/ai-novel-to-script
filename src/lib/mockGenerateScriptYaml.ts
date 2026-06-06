import { ParsedChapter, ScriptYaml } from './types';

/**
 * Mock function that simulates AI-powered script generation.
 *
 * Returns a fixed example based on 《笑的历史》.
 * Called by scriptGenerator.ts when mode is "mock".
 * When real AI is integrated, this file is no longer needed.
 */
export function mockGenerateScriptYaml(
  _inputText: string,
  chapters: ParsedChapter[]
): ScriptYaml {
  return {
    script: {
      metadata: {
        title: '笑的历史',
        original_title: '笑的历史',
        source_type: 'novel',
        adaptation_type: 'film',
        language: 'zh-CN',
        version: '0.1.0',
        created_by: 'AI 小说转剧本工具',
        created_at: new Date().toISOString(),
        description: '改编自短篇小说《笑的历史》，讲述一个女性从童年到婚后逐渐失去笑声的故事。',
      },

      source: {
        chapter_count: chapters.length,
        chapters: chapters.map((ch) => ({
          chapter_id: ch.chapter_id,
          title: ch.title,
          original_order: ch.original_order,
          summary: getChapterSummary(ch.chapter_id),
          key_events: getChapterKeyEvents(ch.chapter_id),
          emotional_arc: getChapterEmotionalArc(ch.chapter_id),
          adaptation_notes: '',
        })),
      },

      characters: [
        {
          character_id: 'char_001',
          name: '我',
          role: 'protagonist',
          gender: '女',
          age_range: '童年—成年',
          description: '故事叙述者，从小爱笑，在家庭变故和婚姻压力下逐渐失去笑容。',
          motivation: '渴望自由表达情感，找回失去的笑。',
          emotional_state: '压抑、迷茫',
          relationships: [
            {
              target_character_id: 'char_002',
              relationship_type: '母女',
              description: '母亲是女主的依靠，但母亲自己也承受着家庭压力。',
            },
            {
              target_character_id: 'char_003',
              relationship_type: '夫妻',
              description: '丈夫起初宠爱女主，后来因家庭压力变得冷漠。',
            },
            {
              target_character_id: 'char_004',
              relationship_type: '父女',
              description: '父亲曾经被女主的笑感染，但也是家庭压力的来源。',
            },
            {
              target_character_id: 'char_005',
              relationship_type: '婆媳',
              description: '婆婆是压迫女主的重要人物，不许她笑。',
            },
          ],
        },
        {
          character_id: 'char_002',
          name: '娘',
          role: 'supporting',
          gender: '女',
          age_range: '中年',
          description: '女主的母亲，温柔但无力改变家庭命运。',
          motivation: '保护女儿，让家庭和睦。',
          emotional_state: '隐忍、疲惫',
          relationships: [
            {
              target_character_id: 'char_001',
              relationship_type: '母女',
              description: '女儿是她最大的牵挂。',
            },
            {
              target_character_id: 'char_004',
              relationship_type: '夫妻',
              description: '与丈夫关系紧张，经常因家庭经济争吵。',
            },
          ],
        },
        {
          character_id: 'char_003',
          name: '你',
          role: 'supporting',
          gender: '男',
          age_range: '成年',
          description: '女主的丈夫，起初对女主很好，后来因家族破产变得冷漠。',
          motivation: '维持家族体面，重振家业。',
          emotional_state: '焦虑、压抑',
          relationships: [
            {
              target_character_id: 'char_001',
              relationship_type: '夫妻',
              description: '爱过女主，但被家庭责任压倒。',
            },
            {
              target_character_id: 'char_005',
              relationship_type: '母子',
              description: '受母亲影响，对妻子态度矛盾。',
            },
          ],
        },
        {
          character_id: 'char_004',
          name: '爸爸',
          role: 'supporting',
          gender: '男',
          age_range: '中年',
          description: '女主的父亲，脾气暴躁但内心爱女儿。',
          motivation: '让家庭体面生活。',
          emotional_state: '愤怒、无奈',
          relationships: [
            {
              target_character_id: 'char_001',
              relationship_type: '父女',
              description: '被女儿的笑融化过，但生活的重压让他忘记了温柔。',
            },
            {
              target_character_id: 'char_002',
              relationship_type: '夫妻',
              description: '与妻子因经济问题频繁争吵。',
            },
          ],
        },
        {
          character_id: 'char_005',
          name: '婆婆',
          role: 'antagonist',
          gender: '女',
          age_range: '老年',
          description: '夫家的长辈，严厉刻板，认为笑是不庄重的表现。',
          motivation: '维护家族规矩和体面。',
          emotional_state: '冷漠、固执',
          relationships: [
            {
              target_character_id: 'char_001',
              relationship_type: '婆媳',
              description: '看不惯儿媳的爱笑，认为没有规矩。',
            },
            {
              target_character_id: 'char_003',
              relationship_type: '母子',
              description: '对儿子有很强控制欲。',
            },
          ],
        },
        {
          character_id: 'char_006',
          name: '郭妈妈',
          role: 'supporting',
          gender: '女',
          age_range: '中年',
          description: '夫家的帮佣或亲戚，对女主有一定同情。',
          motivation: '维持生计。',
          emotional_state: '谨慎、善良',
          relationships: [
            {
              target_character_id: 'char_001',
              relationship_type: '主仆',
              description: '在夫家帮女主分担家务，偶尔安慰女主。',
            },
          ],
        },
        {
          character_id: 'char_007',
          name: '小五',
          role: 'supporting',
          gender: '男',
          age_range: '少年',
          description: '夫家的仆人或者弟弟辈的人物，纯真善良。',
          motivation: '在大家庭中生存。',
          emotional_state: '乐观、天真',
          relationships: [
            {
              target_character_id: 'char_001',
              relationship_type: '朋友',
              description: '是女主在夫家少有的可以放松相处的人。',
            },
          ],
        },
      ],

      locations: [
        {
          location_id: 'loc_001',
          name: '娘家',
          type: '住宅',
          description: '女主童年生活的家，充满笑声和温暖，但也有父母争吵的阴影。',
          atmosphere: '温馨与压抑交织',
        },
        {
          location_id: 'loc_002',
          name: '夫家',
          type: '住宅',
          description: '丈夫家的宅院，规整而阴沉，充满了规矩和压抑。',
          atmosphere: '沉闷、压抑',
        },
        {
          location_id: 'loc_003',
          name: '厨房',
          type: '室内',
          description: '夫家的厨房，是女主和郭妈妈短暂喘息交流的地方。',
          atmosphere: '烟火气、暂时的安全感',
        },
        {
          location_id: 'loc_004',
          name: '夫家内室',
          type: '室内',
          description: '女主和丈夫的卧室，私密空间，见证了关系的演变。',
          atmosphere: '安静、疏离',
        },
      ],

      scenes: [
        {
          scene_id: 'sc_001',
          source_chapter_id: 'ch_001',
          scene_number: 1,
          title: '女主回答为什么不爱笑',
          location_id: 'loc_001',
          location_name: '娘家',
          time_of_day: '午后',
          scene_type: 'dialogue',
          characters: ['char_001'],
          scene_goal: '引出故事的悬念——为什么曾经那么爱笑的人现在不笑了。',
          conflict: '女主现在的沉默与童年时的爱笑形成对比。',
          summary: '开篇，女主用平静的语调回忆自己的笑的历史，自问为什么不再笑了。',
          beats: [
            {
              beat_id: 'beat_001_01',
              type: 'emotion',
              content: '女主面对镜头（或画外音）讲述自己曾经多么爱笑。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_001_02',
              type: 'memory',
              content: '闪过童年大笑的画面。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_001_03',
              type: 'emotion',
              content: '回到现在，女主表情平静但眼神悲伤。',
              related_character_id: 'char_001',
            },
          ],
          dialogue: [
            {
              dialogue_id: 'dlg_001_01',
              speaker: 'char_001',
              speaker_name: '我',
              line: '别人都说我爱笑。我小的时候，真是成天笑。',
              emotion: '平静中带着怀念',
              action: '',
            },
            {
              dialogue_id: 'dlg_001_02',
              speaker: 'char_001',
              speaker_name: '我',
              line: '我妈说，我生下来，两个月就学会了笑。',
              emotion: '淡淡的自豪',
              action: '',
            },
          ],
          visual_notes: '暖色调童年回忆与冷色调现在交替。',
          sound_notes: '背景安静，只有女主的旁白声。',
          transition: '直接切入童年的回忆。',
          unresolved_issues: '',
        },
        {
          scene_id: 'sc_002',
          source_chapter_id: 'ch_001',
          scene_number: 2,
          title: '童年的笑',
          location_id: 'loc_001',
          location_name: '娘家',
          time_of_day: '白天',
          scene_type: 'montage',
          characters: ['char_001', 'char_002', 'char_004'],
          scene_goal: '展现女主童年时期的快乐与纯真，设定对比基调。',
          conflict: '家庭贫困但女主的笑让家里充满温暖。',
          summary: '一系列片段展示女主的童年：笑是她最显著的特征，她的笑感染家人和邻居。',
          beats: [
            {
              beat_id: 'beat_002_01',
              type: 'event',
              content: '小女主在院子里大笑，邻居路过也被感染。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_002_02',
              type: 'action',
              content: '娘在屋里做事，听到女儿的笑声也露出微笑。',
              related_character_id: 'char_002',
            },
            {
              beat_id: 'beat_002_03',
              type: 'visual',
              content: '阳光洒在小院的画面，色调温暖明亮。',
              related_character_id: 'char_001',
            },
          ],
          dialogue: [
            {
              dialogue_id: 'dlg_002_01',
              speaker: 'char_002',
              speaker_name: '娘',
              line: '这孩子，也不知哪儿来那么多高兴事。',
              emotion: '欣慰',
              action: '一边做针线活一边笑',
            },
          ],
          visual_notes: '暖色调，阳光充足。小女主的笑脸特写。',
          sound_notes: '孩童的笑声，鸟鸣声，轻快的背景音乐。',
          transition: '叠化到父亲回家的场景。',
          unresolved_issues: '',
        },
        {
          scene_id: 'sc_003',
          source_chapter_id: 'ch_001',
          scene_number: 3,
          title: '笑让父亲消气',
          location_id: 'loc_001',
          location_name: '娘家',
          time_of_day: '傍晚',
          scene_type: 'drama',
          characters: ['char_001', 'char_004', 'char_002'],
          scene_goal: '展示笑的力量——女主的笑能化解家庭矛盾。',
          conflict: '父亲因贫困而愤怒，但被女儿的笑融化。',
          summary: '父亲在外面受了气，回家板着脸。全家人都不敢说话，只有小女主用笑去感染他。',
          beats: [
            {
              beat_id: 'beat_003_01',
              type: 'event',
              content: '父亲怒气冲冲地进门，娘和家人都紧张起来。',
              related_character_id: 'char_004',
            },
            {
              beat_id: 'beat_003_02',
              type: 'action',
              content: '小女主对着父亲露出灿烂笑容，父亲的表情逐渐松动。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_003_03',
              type: 'emotion',
              content: '父亲终于忍不住笑了，家里的紧张气氛化解。',
              related_character_id: 'char_004',
            },
          ],
          dialogue: [
            {
              dialogue_id: 'dlg_003_01',
              speaker: 'char_004',
              speaker_name: '爸爸',
              line: '笑什么笑！家里都快揭不开锅了！',
              emotion: '愤怒',
              action: '拍桌子',
            },
            {
              dialogue_id: 'dlg_003_02',
              speaker: 'char_002',
              speaker_name: '娘',
              line: '孩子还小，别把火撒在娃身上。',
              emotion: '担忧',
              action: '护着女儿',
            },
            {
              dialogue_id: 'dlg_003_03',
              speaker: 'char_004',
              speaker_name: '爸爸',
              line: '算了算了，看你笑的……这孩子。',
              emotion: '无奈转温柔',
              action: '摸了摸女儿的头',
            },
          ],
          visual_notes: '室内光线昏暗，但女主的笑脸是画面中最亮的部分。',
          sound_notes: '父亲的怒吼声，然后安静，然后父亲的笑声。',
          transition: '时间跳跃到女主出嫁后。',
          unresolved_issues: '',
        },
        {
          scene_id: 'sc_004',
          source_chapter_id: 'ch_002',
          scene_number: 4,
          title: '初到夫家',
          location_id: 'loc_002',
          location_name: '夫家',
          time_of_day: '白天',
          scene_type: 'transition',
          characters: ['char_001', 'char_003', 'char_005'],
          scene_goal: '展示女主进入新环境的期待与不安。',
          conflict: '新环境的规矩与女主自由天性的冲突初现。',
          summary: '女主初嫁到夫家，对一切都感到好奇和紧张。丈夫对她很好，但婆婆的态度冷淡。',
          beats: [
            {
              beat_id: 'beat_004_01',
              type: 'event',
              content: '轿子到达夫家门口，女主被搀扶出来。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_004_02',
              type: 'visual',
              content: '夫家宅院的全景——规整但显得有些冰冷。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_004_03',
              type: 'emotion',
              content: '婆婆初次见面的眼神让女主感到不安。',
              related_character_id: 'char_005',
            },
          ],
          dialogue: [
            {
              dialogue_id: 'dlg_004_01',
              speaker: 'char_005',
              speaker_name: '婆婆',
              line: '来了就好。以后在这个家，要守这个家的规矩。',
              emotion: '冷淡',
              action: '上下打量女主',
            },
            {
              dialogue_id: 'dlg_004_02',
              speaker: 'char_003',
              speaker_name: '你',
              line: '娘，她刚来，慢慢习惯。',
              emotion: '为妻子说话',
              action: '握住女主的手',
            },
          ],
          visual_notes: '夫家色调偏冷（青灰色调），与娘家暖色调形成对比。',
          sound_notes: '安静得能听到自己的脚步声。',
          transition: '切到几天后的厨房。',
          unresolved_issues: '',
        },
        {
          scene_id: 'sc_005',
          source_chapter_id: 'ch_002',
          scene_number: 5,
          title: '第一次因大笑受责备',
          location_id: 'loc_003',
          location_name: '厨房',
          time_of_day: '午后',
          scene_type: 'drama',
          characters: ['char_001', 'char_005', 'char_006'],
          scene_goal: '展示笑开始被压制——这是女主笑被剥夺的关键转折点。',
          conflict: '女主的自然笑声触怒了婆婆，婆婆用规矩来压制她。',
          summary: '女主在厨房和郭妈妈聊天，因开心大笑。婆婆突然出现，严厉训斥她。',
          beats: [
            {
              beat_id: 'beat_005_01',
              type: 'action',
              content: '女主和郭妈妈在厨房一边劳作一边说笑。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_005_02',
              type: 'event',
              content: '婆婆突然出现在厨房门口，脸色铁青。',
              related_character_id: 'char_005',
            },
            {
              beat_id: 'beat_005_03',
              type: 'emotion',
              content: '女主的笑容凝固，第一次意识到笑是一种"不规矩"。',
              related_character_id: 'char_001',
            },
          ],
          dialogue: [
            {
              dialogue_id: 'dlg_005_01',
              speaker: 'char_005',
              speaker_name: '婆婆',
              line: '一个正经人家的媳妇，怎能这样放肆大声笑？',
              emotion: '愤怒、不屑',
              action: '站在门口冷冷看着',
            },
            {
              dialogue_id: 'dlg_005_02',
              speaker: 'char_006',
              speaker_name: '郭妈妈',
              line: '太太别生气，我们说着玩呢。',
              emotion: '紧张、讨好',
              action: '低头',
            },
            {
              dialogue_id: 'dlg_005_03',
              speaker: 'char_001',
              speaker_name: '我',
              line: '……我以后注意。',
              emotion: '委屈、压抑',
              action: '低下头，眼眶红了',
            },
          ],
          visual_notes: '厨房的温暖色调在婆婆出现后变冷。女主低头的特写。',
          sound_notes: '笑声戛然而止，只有锅里的水咕噜声。',
          transition: '时间跳跃，家庭开始出现变故。',
          unresolved_issues: '',
        },
        {
          scene_id: 'sc_006',
          source_chapter_id: 'ch_003',
          scene_number: 6,
          title: '家境败落',
          location_id: 'loc_002',
          location_name: '夫家',
          time_of_day: '夜晚',
          scene_type: 'drama',
          characters: ['char_001', 'char_003', 'char_005'],
          scene_goal: '展示外部压力如何加剧女主的困境。',
          conflict: '夫家家道中落，经济压力让丈夫和婆婆对女主的态度更加苛刻。',
          summary: '夫家生意失败后，全家的气氛更加阴沉。丈夫对女主不再温柔，婆婆更加挑剔。',
          beats: [
            {
              beat_id: 'beat_006_01',
              type: 'event',
              content: '丈夫深夜回家，面色凝重，一言不发。',
              related_character_id: 'char_003',
            },
            {
              beat_id: 'beat_006_02',
              type: 'action',
              content: '女主端茶给丈夫，丈夫不耐烦地挥手打翻。',
              related_character_id: 'char_003',
            },
            {
              beat_id: 'beat_006_03',
              type: 'emotion',
              content: '女主站在原地，茶杯碎片在地上，她不知所措。',
              related_character_id: 'char_001',
            },
          ],
          dialogue: [
            {
              dialogue_id: 'dlg_006_01',
              speaker: 'char_003',
              speaker_name: '你',
              line: '家里都快完了，你还整天想些没用的。',
              emotion: '疲惫、烦躁',
              action: '背对着女主',
            },
            {
              dialogue_id: 'dlg_006_02',
              speaker: 'char_001',
              speaker_name: '我',
              line: '我没有……我只是……',
              emotion: '委屈、无助',
              action: '声音越来越小',
            },
            {
              dialogue_id: 'dlg_006_03',
              speaker: 'char_005',
              speaker_name: '婆婆',
              line: '都是你娶的媳妇不旺夫，才会这样。',
              emotion: '怨毒',
              action: '在隔壁房间大声说，让女主听到',
            },
          ],
          visual_notes: '昏暗的烛光/灯光，阴影遮住了人物的半张脸。空荡的房间暗示家道中落。',
          sound_notes: '夜晚的寂静，远处偶尔有狗叫声。',
          transition: '切到第二天早晨的内室。',
          unresolved_issues: '',
        },
        {
          scene_id: 'sc_007',
          source_chapter_id: 'ch_003',
          scene_number: 7,
          title: '彻底笑不出来',
          location_id: 'loc_004',
          location_name: '夫家内室',
          time_of_day: '深夜',
          scene_type: 'internal',
          characters: ['char_001'],
          scene_goal: '故事高潮——女主意识到自己已经失去了笑的能力。',
          conflict: '女主对着镜子试图笑，却发现自己笑不出来了。',
          summary: '夜深人静，女主独自坐在内室。她想起过去爱笑的自己，对着镜子尝试笑，却只能做出一个僵硬的表情。',
          beats: [
            {
              beat_id: 'beat_007_01',
              type: 'action',
              content: '女主慢慢走到镜子前。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_007_02',
              type: 'memory',
              content: '镜中仿佛闪过童年时大笑的自己。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_007_03',
              type: 'emotion',
              content: '女主用力扯动嘴角，却只做出一个扭曲的表情。',
              related_character_id: 'char_001',
            },
            {
              beat_id: 'beat_007_04',
              type: 'emotion',
              content: '女主放弃尝试，眼泪无声滑落。',
              related_character_id: 'char_001',
            },
          ],
          dialogue: [
            {
              dialogue_id: 'dlg_007_01',
              speaker: 'char_001',
              speaker_name: '我',
              line: '（内心独白）我怎么会笑不出来了呢？我以前那么爱笑的……',
              emotion: '困惑、悲伤',
              action: '对着镜子用手指拉扯自己的嘴角',
            },
          ],
          visual_notes: '月光透过窗户照进来，冷色调。镜中女主的脸一半在光里一半在阴影中。',
          sound_notes: '极其安静，只有偶尔的夜风声。',
          transition: '淡出，回到开篇的画面——女主平静的表情。',
          unresolved_issues: '女主能否在未来重新找回笑容？',
        },
      ],

      structure: {
        act_type: 'three-act',
        acts: [
          {
            act_id: 'act_01',
            title: '第一幕：笑的时代',
            purpose: '建立女主爱笑的天性，展示笑带给家庭的力量。',
            related_scenes: ['sc_001', 'sc_002', 'sc_003'],
          },
          {
            act_id: 'act_02',
            title: '第二幕：笑的剥夺',
            purpose: '展示社会环境、家庭规矩如何一步步压制女主的笑声。',
            related_scenes: ['sc_004', 'sc_005', 'sc_006'],
          },
          {
            act_id: 'act_03',
            title: '第三幕：笑的消失',
            purpose: '高潮与结局——女主发现自己已经失去了笑的能力。',
            related_scenes: ['sc_007'],
          },
        ],
      },

      notes: {
        adaptation_strategy:
          '采用非线性叙事，以女主的内心独白为线索，穿插回忆与现实，展现笑声的消失过程。',
        preserved_elements: [
          '第一人称叙事视角',
          '笑的隐喻——自由与压迫的象征',
          '家庭关系作为核心冲突',
          '时代背景对个人命运的塑造',
        ],
        changed_elements: [
          '将内心独白改为画外音和视觉画面',
          '将时间跨度很大的叙述压缩为关键场景',
          '增加了视觉对比（暖色调/冷色调）来强化情感变化',
        ],
        unresolved_issues: [
          '女主的最终命运是否暗示某种出路？',
          '丈夫的角色是否可以有更多层次？',
          '结尾是否需要在绝望中保留一丝希望？',
        ],
      },
    },
  };
}

// ---- Helpers to generate chapter-level summaries ----

function getChapterSummary(chapterId: string): string {
  const map: Record<string, string> = {
    ch_001: '女主回忆自己童年时期如何爱笑，笑是她与世界互动的方式。她的笑能感染家人，甚至让愤怒的父亲消气。',
    ch_002: '女主嫁到夫家，初到陌生环境。婆婆的严厉和规矩开始压迫她的天性，第一次因笑受责备。',
    ch_003: '夫家家境败落，家庭矛盾加剧。丈夫变得冷漠，婆婆更加苛责，女主发现自己已经彻底笑不出来了。',
  };
  return map[chapterId] ?? '';
}

function getChapterKeyEvents(chapterId: string): string[] {
  const map: Record<string, string[]> = {
    ch_001: [
      '女主从小到大以笑闻名',
      '笑让愤怒的父亲平静下来',
      '笑的童年是女主最珍贵的记忆',
    ],
    ch_002: [
      '女主嫁入夫家',
      '发现新环境的规矩森严',
      '第一次因大笑被婆婆训斥',
    ],
    ch_003: [
      '夫家经济状况急转直下',
      '丈夫和婆婆对女主的态度越来越差',
      '女主发现自己已经笑不出来了',
    ],
  };
  return map[chapterId] ?? [];
}

function getChapterEmotionalArc(chapterId: string): string {
  const map: Record<string, string> = {
    ch_001: '从快乐怀旧走向温暖无奈——童年的笑是自由的象征。',
    ch_002: '从期待与不安走向压抑——笑开始被定义为"不合规矩"。',
    ch_003: '从压抑走向绝望——笑的能力被彻底剥夺。',
  };
  return map[chapterId] ?? '';
}
