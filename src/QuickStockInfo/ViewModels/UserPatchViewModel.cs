﻿// ======================================
// Author: Komal Dubey
// Email:  kkdubey12@gmail.com
// 
// 

// ======================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace QuickStockInfo.ViewModels
{
    public class UserPatchViewModel
    {
        public string FullName { get; set; }

        public string JobTitle { get; set; }

        public string PhoneNumber { get; set; }

        public string Configuration { get; set; }
    }
}
