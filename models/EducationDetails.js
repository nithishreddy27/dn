import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {

    user: { type: String, required: true },
    
    marks:{
        tenth:{
          percentage:{
            type:Number,
          },
          gpa:{
            type:Number
          },
          yearofpass:{
            type:Number,
          },
          schoolName:{
            type:String,
          },
          location:{
            type:String
          },
          board:{
            type:String
          }
        },

        inter:{
          percentage:{
            type:Number,
          },
          yearofpass:{
            type:Number
          },
          collegeName:{
            type:String,
          },
          location:{
            type:String
          },
          board:{
            type:String
          }
        },

        diploma:{
          semester:[
            {
                semester:{type:Number},
                gpa:{type:String},
                backlogs:{type:String}
            }
         ],
          yearofpass:{
            type:Number
          },
          collegeName:{
            type:String,
          },
          location:{
            type:String
          },
          board:{
            type:String
          },
          branch:{
            type:String
          }
        },

        undergraduate:{
            degree:{type:String},
            semester:[
                {
                    semester:{type:Number},
                    gpa:{type:Number},
                    backlogs:{type:Number}
                }
            ],
            entrance:{
              type:String,
            },
            rank:{
              type:String,
            },
            cgpa:{
                type:Number,
              },    
            percentage:{
                type:Number
              },
            totalbacklogs:{
                type:String,
              },
            history:{
                type:Boolean,
              },
              yearofpass:{
                type:Number
              },
              college: {
                name: {
                  type: String,
                },
                code: {
                  type: String,
                },
                campus: {
                  type: String
                },
                passphrase: {
                  type: String,
                },
                website: {
                  type: String,
                },
                affiliatedUniversity:{
                  type: String,
                }
              },
        },

        postgraduate:{
          degree:{type:String},
          semester:[
              {
                  semester:{type:Number},
                  gpa:{type:Number},
                  backlogs:{type:Number}
              }
          ],
          quota:{
            type:String,
          },
          cgpa:{
              type:Number,
            },    
          percentage:{
              type:Number
            },
          totalbacklogs:{
              type:Number,
            },
          history:{
              type:Boolean,
            },
            yearofpass:{
              type:Number
            },
            college: {
              name: {
                type: String,
              },
              code: {
                type: String,
              },
              campus: {
                type: String
              },
              passphrase: {
                type: String,
              },
              website: {
                type: String,
              },
            },
        }
    },
  },
  { timestamps: true }
);

export default mongoose.models.education || mongoose.model("education", userSchema);
