library(readr)
library(dplyr)
main_data <- read_csv("C:/Users/rumucao/OneDrive - Universiteit Utrecht/Bureaublad/Qualia/INFOMELP/Main_data.csv")
View(main_data)

#####========== Select & Rename Data ==========#####
filtered_main_data <- main_data

final_data <- filtered_main_data %>% select(ResponseId, DemModQues_age, DemModQues_education,
                                            DemModQues_gender, DemModQues_AI, DemModQues_Chatbot, DemModQues_personal,
                                            DemModQues_interest, `attitude/trust in ai_1`, `attitude/trust in ai_2`,
                                            `attitude/trust in ai_3`, `attitude/trust in ai_4`,`attitude/trust in ai_5`,
                                            `attitude/trust in ai_6`, `attitude/trust in ai_7`, `attitude/trust in ai_8`,
                                            `attitude/trust in ai_9`, `attitude/trust in ai_10`,`attitude/trust in ai_11`,
                                            Exp_condition, PostQues_3, PostQues_10, PostQues_14, PostQues_20, PostQues_25)


final_data <- final_data %>% rename(Age = DemModQues_age, 
                                    `Education Level` = DemModQues_education, Gender = DemModQues_gender,
                                    `Experience with AI` = DemModQues_AI, `Experience with Chatbot` = DemModQues_Chatbot,
                                    `Personal Experience related to crime scene` = DemModQues_personal,
                                    `Interest in crime scenes and investigations` = DemModQues_interest,
                                    `Tendency to recommend the AI` = `attitude/trust in ai_9`,
                                    `Perceived AI trustworthy` = `attitude/trust in ai_10`,
                                    `Perceived AI empathy` = `attitude/trust in ai_11`)

summary(final_data[c("PostQues_3", "PostQues_10", "PostQues_14", "PostQues_20", "PostQues_25")])

replacement_map <- c(
  "Definitely yes" = 7,
  "Yes" = 6,
  "Probably yes" = 5,
  "Uncertain if yes or no" = 4,
  "Probably not" = 3,
  "No" = 2,
  "Definitely not" = 1
)

# Mutate: AI Questions
final_data <- final_data %>%
  mutate(across(
    c(`attitude/trust in ai_1`, `attitude/trust in ai_2`,`attitude/trust in ai_3`, `attitude/trust in ai_4`,
      `attitude/trust in ai_5`, `attitude/trust in ai_6`, `attitude/trust in ai_7`, `attitude/trust in ai_8`,
      `Tendency to recommend the AI`, `Perceived AI trustworthy`, `Perceived AI empathy`), ~ replacement_map_AI_Questions[.]))

# Mutate: Crime Related Question
final_data <- final_data %>%
  mutate(across(
    c(`Interest in crime scenes and investigations`), ~ replacement_map_Crime_Related_Question[.]))

# Mutate: charater to numeric
final_data <- final_data %>%
  mutate(across(
    c(Age),
    ~ as.numeric(.)
  ))

final_data <- final_data %>%mutate(across(c(`Age`, `AI Attitude`), `scale`))

final_data <- final_data %>%
  mutate(across(c(PostQues_3, PostQues_10, PostQues_14, PostQues_20, PostQues_25),
                ~ as.character(.)))

replacement_map_AI_Questions <- c(
  "1 (strongly disagree)" = 1,
  "2" = 2, "3" = 3, "4" = 4, "5" = 5, "6" = 6,
  "7 (strongly agree)" = 7
)

replacement_map_Crime_Related_Question <- c(
  "1-Not interested at all" = 1,
  "2" = 2, "3" = 3, "4" = 4, "5" = 5, "6" = 6,
  "7-Very interested" = 7
)

replacement_map_Experience_Question <- c(
  "1-Not familiar at all" = 1,
  "2" = 2, "3" = 3, "4" = 4, "5" = 5, "6" = 6,
  "7-Very Familiar" = 7
)

# Mutate: Critical Question 
final_data <- final_data %>%
  mutate(across(
    c(PostQues_3, PostQues_10, PostQues_14, PostQues_20, PostQues_25), ~ replacement_map[.]))

# Mutate: Experience w/ AI, Chatbot
final_data <- final_data %>%
  mutate(across(
    c(`Experience with AI`, `Experience with Chatbot`), ~ replacement_map_Experience_Question[.]))




# Mutate: AI Questions
final_data <- final_data %>%
  mutate(across(
    c(`attitude/trust in ai_1`, `attitude/trust in ai_2`,`attitude/trust in ai_3`, `attitude/trust in ai_4`,
      `attitude/trust in ai_5`, `attitude/trust in ai_6`, `attitude/trust in ai_7`, `attitude/trust in ai_8`,
      `Tendency to recommend the AI`, `Perceived AI trustworthy`, `Perceived AI empathy`), ~ replacement_map_AI_Questions[.]))

# Mutate: Crime Related Question
final_data <- final_data %>%
  mutate(across(
    c(`Interest in crime scenes and investigations`), ~ replacement_map_Crime_Related_Question[.]))

# Count: False Memories
final_data <- final_data %>%
  mutate(false_memories = rowSums(select(., PostQues_3, PostQues_10, PostQues_14, PostQues_20, PostQues_25) > 4))

# Count: AI Attitude Scale
final_data <- final_data %>%
  mutate(`AI Attitude` = rowSums(select(., 
                                        `attitude/trust in ai_1`, `attitude/trust in ai_2`, `attitude/trust in ai_3`,
                                        `attitude/trust in ai_4`, `attitude/trust in ai_5`, `attitude/trust in ai_6`, 
                                        `attitude/trust in ai_7`, `attitude/trust in ai_8`
  ), na.rm = TRUE)) 


#####========== Different Conditions ==========#####
control_data <- final_data %>% filter(`Exp_condition`== 'none')
static_chatbot_data <- final_data %>% filter(`Exp_condition`== 'static-chatbot')
chatbot_data <- final_data %>% filter(`Exp_condition`== 'chatbot')


#####========== Mixed Effect Model ==========#####
library(Matrix)
library(lme4)
library(MASS)


# model_pois <- glmer(
#   false_memories ~ Age + `Education Level` + Gender + `Experience with AI` + `Experience with Chatbot` 
#                   + `Personal Experience related to crime scene` + `Interest in crime scenes and investigations`
#                   + `Tendency to recommend the AI` + `Perceived AI trustworthy` + `Perceived AI empathy`
#                   + `AI Attitude` + `Task Workload (Raw NASA-TLX)` + (1 | ResponseId),
#   data = final_data,
#   family = poisson(link = log)
# )

sapply(final_data, function(x) length(unique(x)))
table(final_data$false_memories)
table(final_data$PostQues_10)

# install.packages(performance)
# library(performance)
# 
# check_overdispersion(model_pois)
final_data$Exp_condition <- factor(final_data$Exp_condition)
final_data$Exp_condition <- relevel(final_data$Exp_condition, ref = "none")

model_nb <- glm.nb(
  false_memories ~ `Exp_condition` + Age + `Experience with AI` + `Experience with Chatbot` 
  + `Personal Experience related to crime scene` + `Interest in crime scenes and investigations`
  + `Tendency to recommend the AI` + `Perceived AI trustworthy` + `Perceived AI empathy`
  + `AI Attitude`,
  data = final_data
)
summary(model_nb)

# 使用 Poisson 回归模型
model_pois <- glm(
  false_memories ~ `Exp_condition` + Age + `Experience with AI` + `Experience with Chatbot` 
  + `Personal Experience related to crime scene` + `Interest in crime scenes and investigations`
  + `Tendency to recommend the AI` + `Perceived AI trustworthy` + `Perceived AI empathy`
  + `AI Attitude`,
  data = final_data,
  family = poisson(link = "log")
)

# 查看ANOVA结果，检查Exp_condition的显著性
anova(model_pois, test = "Chisq")

# 查看模型的摘要，包括Exp_condition的回归系数
summary(model_pois)

# 分组计算Exp_condition下false_memories的均值和标准差
library(dplyr)

final_data %>%
  group_by(`Exp_condition`) %>%
  summarise(
    mean_false_memories = mean(false_memories, na.rm = TRUE),
    sd_false_memories = sd(false_memories, na.rm = TRUE),
    n = n()
  )

# 可视化Exp_condition对false_memories的影响
library(ggplot2)

ggplot(final_data, aes(x = `Exp_condition`, y = false_memories)) +
  geom_boxplot() +
  labs(title = "Effect of Exp_condition on false_memories",
       x = "Experiment Condition",
       y = "False Memories")

install.packages("emmeans")  # 安装 emmeans 包
library(emmeans)
emmeans(model_pois , pairwise ~ Exp_condition)
